from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from model.predict import predict_discharge_readiness

load_dotenv()

app = Flask(__name__)
CORS(app)

PORT = int(os.getenv('FLASK_PORT', 5001))

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'ML Service is running'
    }), 200
    
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # validate required fields
        required_fields = ['age', 'lengthOfStay', 'temperature', 'heartRate', 'diagnosis']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # get prediction
        score, recommendation = predict_discharge_readiness(
            age=data['age'],
            length_of_stay=data['lengthOfStay'],
            temperature=data['temperature'],
            heart_rate=data['heartRate'],
            diagnosis=data['diagnosis']
        )
        
        return jsonify({
            'score': score,
            'recommendation': recommendation,
            'success': True
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

if __name__ == '__main__':
    print(f"🤖 ML Service running on http://localhost:{PORT}")
    app.run(host='0.0.0.0', port=PORT, debug=True)