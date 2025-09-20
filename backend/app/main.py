from flask import Flask
from app.routes.gemini import gemini_bp

app = Flask(__name__)
app.register_blueprint(gemini_bp, url_prefix="/gemini")

if __name__ == "__main__":
    app.run(debug=True, port=5000)