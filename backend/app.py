from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import route blueprints
from routes.pdf_routes import pdf_bp
from routes.ai_routes import ai_bp

app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:5173",
    "http://localhost:3000"
]}})

# Register blueprints
app.register_blueprint(pdf_bp, url_prefix='/api/pdf')
app.register_blueprint(ai_bp, url_prefix='/api/ai')

@app.route('/')
def index():
    return {
        'status': 'running',
        'service': 'Advanced AI Resume Builder - Unified Backend',
        'endpoints': {
            'pdf': '/api/pdf/*',
            'ai': '/api/ai/*'
        }
    }

@app.route('/health')
def health():
    return {
        'status': 'healthy',
        'services': {
            'pdf_generation': 'active',
            'ai_enhancement': 'active'
        }
    }

if __name__ == '__main__':
    print("\n" + "="*60)
    print("Advanced AI Resume Builder - Unified Backend Server")
    print("="*60)
    print("✓ PDF Generation Service: /api/pdf/*")
    print("✓ AI Enhancement Service: /api/ai/*")
    print("="*60 + "\n")
    
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
