import json

def generate_response(data, status=200):
    response = {
        'status': status,
        'data': data
    }
    return json.dumps(response)

def generate_error_response(message, status=400):
    response = {
        'status': status,
        'error': message
    }
    return json.dumps(response)