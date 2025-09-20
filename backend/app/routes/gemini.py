from flask import Blueprint, request, jsonify
from app.services.gemini_service import query_gemini
from google.genai import types
from PIL import Image
from pymongo import MongoClient
from datetime import datetime
from gridfs import GridFS
from bson import ObjectId

import io

#set up blueprint router
gemini_bp = Blueprint("gemini", __name__)

#define Mongo instance
mongoClient = MongoClient("mongodb://localhost:27017")
db = mongoClient["healthcare_app"]
fs = GridFS(db)

#expose /process API to frontend
@gemini_bp.route("/process", methods=["POST"])
def process_input():
    #collect user data from survey
    first_name = request.form.get("firstName")
    last_name = request.form.get("lastName")
    symptom_text = request.form.get("symptomText")
    timestamp = request.form.get("timestamp") or datetime.now().isoformat()

    #collect image files
    image_files = request.files.getlist("symptomImages")
    image_ids = []
    for img_file in image_files:
        print(img_file.filename)
        file_id = fs.put(img_file, filename=img_file.filename)
        image_ids.append(file_id)
    
    #create mongo entry
    entry = {
        "first_name": first_name,
        "last_name": last_name,
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

    #create Gemini prompt using given data
    prompt = (
        "You are a medical assistant.\n"
        f"A patient reports the following symptoms:\n\n"
        f"Description: {symptom_text}\n"
        f"The patient has provided {len(image_ids)} images: \n\n"
        "Analyze the patient's reported symptoms and provided images and return a list of identified symptoms in a comma separated format\n" \
        "For example: 'runny nose, cut on finger, bruise on elbow'"
    )

    #get Gemini response
    response = query_gemini([prompt] + image_parts)

    #add response to Mongo entry
    db.symptom_entries.update_one(
        {"_id": ObjectId(entryID)},
        {"$set": {"gemini_output": response["output"]}}
    )
    return jsonify({"response": response["output"]})