from flask import Flask, request, jsonify, send_file, abort, Response
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
from dotenv import load_dotenv
import os
import boto3


load_dotenv()

app = Flask(__name__)
CORS(app)
api = Api(app)


username = os.getenv("MONGO_USERNAME")
password = os.getenv("MONGO_PASSWORD")

mongo_uri = f"mongodb+srv://{username}:{password}@cluster0.taz9t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster07"
mongoClient = MongoClient(mongo_uri)

db = mongoClient["healthcare_app"]
fs = GridFS(db)


class ProcessInput(Resource):
    def post(self):
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
            "A patient reports the following symptoms:\n\n"
            f"Description: {audio_symptoms}\n"
            "Analyze the patient's reported symptoms and the provided images.\n"
            "Return a **list of identified symptoms**, each with a **severity score from 1 to 10**, where 1 is minimal harm and 10 is life-threatening.\n"
            "Use a **comma-separated format**, where each symptom is followed by its severity score in parentheses.\n"
            "Example output: 'runny nose (2), cut on finger (2), bruise on elbow (1)'\n"
            "Do not provide any treatment advice. Focus only on identifying symptoms and assigning severity.\n"
        )
        if (len(image_parts) > 0):
            prompt += f"The patient has provided these {len(image_parts)} images."

        # Get Gemini response
        response = query_gemini([prompt] + image_parts)["output"]

        symptoms = []
        max_severity = 0

        for item in response.split(","):
            item = item.strip()
            if "(" in item and ")" in item:
                # Split the symptom and severity
                symptom_name = item[:item.rfind("(")].strip()
                severity = int(item[item.rfind("(")+1:item.rfind(")")])
                symptoms.append(symptom_name)
                if severity > max_severity:
                    max_severity = severity

        symptom_string = ", ".join(symptoms)
        print("Symptoms:", symptom_string)
        print("Max severity:", max_severity)


        db.symptom_entries.update_one(
            {"_id": ObjectId(entryID)},
            {"$set": {
                "gemini_output": symptom_string,
                "max_severity": max_severity
            }}
        )

        return jsonify({"response": response["output"]})

class GetAllEntries(Resource):
    def get(self):
        entries = list(db.symptom_entries.find())
        
        for entry in entries:
            entry["_id"] = str(entry["_id"])
            if "image_ids" in entry:
                entry["image_ids"] = [str(fid) for fid in entry["image_ids"]]

        return jsonify(entries)


class DeleteEntry(Resource):
    def delete(self, entry_id):
        try:
            result = db.symptom_entries.delete_one({"_id": ObjectId(entry_id)})
            if result.deleted_count == 0:
                return jsonify({"success": False, "message": "Entry not found"})
            return jsonify({"success": True, "message": "Entry deleted"})
        except Exception as e:
            return jsonify({"success": False, "message": str(e)})





api.add_resource(GetAllEntries, "/entries")
api.add_resource(DeleteEntry, "/entries/<string:entry_id>")
api.add_resource(ProcessInput, "/process")

class GetImage(Resource):
    def get(self, image_id):
        try:
            file_data = fs.get(ObjectId(image_id))
            return Response(
                file_data.read(),
                mimetype='image/jpeg',
                headers={"Content-Disposition": f"inline; filename={file_data.filename}"}
            )
        except gridfs.errors.NoFile:
            abort(404, description="Image not found")
        except Exception as e:
            abort(500, description=str(e))

# Add the resource to your API
api.add_resource(GetImage, "/image/<string:image_id>")

if __name__ == "__main__":
    app.run(debug=True, port=5000)