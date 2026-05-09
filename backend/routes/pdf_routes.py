from flask import Blueprint, request, jsonify

pdf_bp = Blueprint('pdf', __name__)

@pdf_bp.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    """
    PDF generation endpoint - returns message to use browser's Print-to-PDF
    Server-side PDF libraries removed for easier deployment on shared hosting
    """
    data = request.get_json()
    
    html_content = data.get('html')
    if not html_content:
        return jsonify({'error': 'No HTML content provided'}), 400

    # Return message indicating browser-based PDF generation should be used
    return jsonify({
        'error': 'Server-side PDF generation not available. Please use browser Print-to-PDF feature.',
        'suggestion': 'The frontend will automatically use browser printing which preserves all styling perfectly.',
        'useBrowserPrint': True
    }), 503
