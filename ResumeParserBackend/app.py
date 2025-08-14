

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

AFFINDA_API_KEY = os.getenv("AFFINDA_API_KEY")

@app.route("/parse-resume", methods=["POST"])
def parse_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    affinda_url = "enter_your_affinda_api_endpoint"
    headers = {
        "Authorization": f"Bearer {AFFINDA_API_KEY}"
    }
    files = {
        "file": (file.filename, file.read())
    }

    response = requests.post(affinda_url, headers=headers, files=files)

    if response.status_code != 201:
        return jsonify({"error": "Failed to parse resume", "details": response.json()}), response.status_code

    return jsonify(response.json())

if __name__ == "__main__":
    app.run(debug=True)
