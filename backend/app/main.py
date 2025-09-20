from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
from app.services.gemini_service import query_gemini
from google.genai import types
from pymongo import MongoClient
from gridfs import GridFS
from datetime import datetime
from bson import ObjectId

app = Flask(__name__)
CORS(app)
api = Api(app)

# Mongo setup
mongoClient = MongoClient("mongodb://localhost:27017")
db = mongoClient["healthcare_app"]
fs = GridFS(db)

db.symptom_entries.update_many({}, {"$unset": {"firstName": "", "lastName": ""}})


class ProcessInput(Resource):
    def post(self):
        #collect user data from survey
        name = request.form.get("name")
        symptom_text = request.form.get("symptomText")
        timestamp = request.form.get("timestamp") or datetime.now().isoformat()

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
            "symptom_text": symptom_text,
            "image_ids": image_ids,
            "timestamp": timestamp
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
            f"Description: {symptom_text}\n"
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

if __name__ == "__main__":
    app.run(debug=True, port=5000)