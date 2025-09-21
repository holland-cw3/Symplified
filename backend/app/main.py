from flask import Flask, request, jsonify, send_file, abort
import io
import gridfs
from flask_restful import Api, Resource
from flask_cors import CORS
from app.services.gemini_service import query_gemini
from google.genai import types
from pymongo import MongoClient
from gridfs import GridFS
from datetime import datetime
from bson import ObjectId
from urllib.parse import quote_plus


app = Flask(__name__)
CORS(app)
api = Api(app)


# Mongo setup
username = "chollan1"
password = "3Abc5bdWdJ0wHPti"  # your raw password

mongo_uri = f"mongodb+srv://{username}:{password}@cluster0.taz9t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster07"
mongoClient = MongoClient(mongo_uri)

db = mongoClient["healthcare_app"]
fs = GridFS(db)

db.symptom_entries.update_many({}, {"$unset": {"firstName": "", "lastName": ""}})


class ProcessInput(Resource):
    def post(self):
        #collect user data from survey
        name = request.form.get("name")
        sex = request.form.get("sex")
        dob = request.form.get("dob")
        address = request.form.get("address")
        blood_type = request.form.get("bloodtype")
        phone = request.form.get("phone")
        email = request.form.get("email")
        insurance = request.form.get("insurance")
        emergency_phone = request.form.get("emergencyphone")
        audio_symptoms = request.form.get("audiosymptoms")
        checkin = request.form.get("checkin") or datetime.now().isoformat()

        #collect image files
        image_files = request.files.getlist("symptomImages")
        image_ids = []
        for img_file in image_files:
            print("INPUT FILE", img_file.filename)
            file_id = fs.put(img_file, filename=img_file.filename)
            image_ids.append(file_id)

        #create mongo entry
        entry = {
            "name": name,
            "sex": sex,
            "dob": dob,
            "address": address,
            "blood_type": blood_type,
            "phone": phone,
            "email": email,
            "insurance": insurance,
            "emergency_phone": emergency_phone,
            "audio_symptoms": audio_symptoms,
            "checkin": checkin,
            "image_ids": image_ids
        }
        
        #insert entry into DB
        insertedEntry = db.symptom_entries.insert_one(entry)
        entryID = insertedEntry.inserted_id

        #convert images to Gemini-compatible format
        image_parts = []
        for file_id in image_ids:
            image_file = fs.get(file_id)
            image_bytes = image_file.read()
            image_parts.append(types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"))

        # Create Gemini prompt
        prompt = (
            "You are a medical assistant.\n"
            f"A patient reports the following symptoms:\n\n"
            f"Description: {audio_symptoms}\n"
            f"The patient has provided {len(image_ids)} images: \n\n"
            "Analyze the patient's reported symptoms and provided images and return a list of identified symptoms in a comma separated format\n" \
            "For example: 'runny nose, cut on finger, bruise on elbow'"
        )

        # Get Gemini response
        response = query_gemini([prompt] + image_parts)

        # Update Mongo entry with Gemini output
        db.symptom_entries.update_one(
            {"_id": ObjectId(entryID)},
            {"$set": {"gemini_output": response["output"]}}
        )

        return jsonify({"response": response["output"]})

# Add resource to API
api.add_resource(ProcessInput, "/process")

class GetImage(Resource):
    def get(self, image_id):
        try:
            file_data = fs.get(ObjectId(image_id))
            return send_file(
                io.BytesIO(file_data.read()),  # convert GridOut to bytes
                attachment_filename=file_data.filename,
                mimetype='image/jpeg'          # adjust if some images are png/gif
            )
        except gridfs.errors.NoFile:
            abort(404, description="Image not found")
        except Exception as e:
            abort(500, description=str(e))

# Add the resource to your API
api.add_resource(GetImage, "/image/<string:image_id>")

if __name__ == "__main__":
    app.run(debug=True, port=5000)