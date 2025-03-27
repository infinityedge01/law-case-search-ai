# filepath: d:\code\fabao\fabao-back\main.py
from flask import Flask, jsonify, request
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # 启用CORS，允许前端访问
    CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
                                    "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"]}})
    
    from api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)