
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
import tempfile

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:5173",
    "https://prashantparshuramkar.host20.uk",
    "https://nishanttech.host20.uk"
]}})

# Try to import PDF generation libraries in order of preference
PDF_LIBRARY = None

try:
    from weasyprint import HTML, CSS
    PDF_LIBRARY = 'weasyprint'
    print("✓ Using WeasyPrint for PDF generation (Best quality)")
except (ImportError, OSError) as e:
    print(f"⚠ WeasyPrint not available: {str(e)[:100]}")
    try:
        from xhtml2pdf import pisa
        PDF_LIBRARY = 'xhtml2pdf'
        print("✓ Using xhtml2pdf for PDF generation")
    except ImportError:
        print("⚠ No server-side PDF library available.")
        print("  Clients will use browser's built-in Print-to-PDF feature.")
        PDF_LIBRARY = None

@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    data = request.get_json()
    
    html_content = data.get('html')
    if not html_content:
        return jsonify({'error': 'No HTML content provided'}), 400

    if not PDF_LIBRARY:
        return jsonify({
            'error': 'Server-side PDF generation not available. Please use browser Print-to-PDF feature.',
            'suggestion': 'The frontend will automatically use browser printing which preserves all styling perfectly.'
        }), 503

    try:
        # Create a temporary file for the PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            tmp_filename = tmp_file.name
        
        # Generate PDF based on available library
        if PDF_LIBRARY == 'weasyprint':
            html_to_pdf_weasyprint(html_content, tmp_filename)
        elif PDF_LIBRARY == 'xhtml2pdf':
            html_to_pdf_xhtml2pdf(html_content, tmp_filename)
        else:
            return jsonify({'error': 'No PDF generation library available'}), 500
        
        # Send the PDF file
        return send_file(
            tmp_filename,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='resume.pdf'
        )
        
    except Exception as e:
        print(f"PDF generation error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'PDF generation failed: {str(e)}'}), 500
    finally:
        # Clean up temporary file after a delay
        try:
            if 'tmp_filename' in locals() and os.path.exists(tmp_filename):
                # Small delay to ensure file is sent before deletion
                import time
                time.sleep(0.5)
                os.unlink(tmp_filename)
        except:
            pass


def html_to_pdf_weasyprint(html_content, output_filename):
    """Convert HTML to PDF using WeasyPrint (best quality, preserves CSS)"""
    from weasyprint import HTML
    
    # WeasyPrint handles CSS beautifully - write directly to file
    HTML(string=html_content, base_url=".").write_pdf(output_filename)


def html_to_pdf_xhtml2pdf(html_content, output_filename):
    """Convert HTML to PDF using xhtml2pdf"""
    from xhtml2pdf import pisa
    
    with open(output_filename, "w+b") as result_file:
        pisa_status = pisa.CreatePDF(
            html_content,
            dest=result_file
        )
    
    if pisa_status.err:
        raise Exception(f"xhtml2pdf conversion failed with error code: {pisa_status.err}")


if __name__ == '__main__':
    print("\n" + "="*60)
    print("Resume Builder - PDF Generation Backend")
    print("="*60)
    if PDF_LIBRARY:
        print(f"✓ PDF Generation: Enabled ({PDF_LIBRARY})")
    else:
        print("ℹ PDF Generation: Using browser Print-to-PDF (recommended)")
    print("="*60 + "\n")
    app.run(debug=True, port=5000)
