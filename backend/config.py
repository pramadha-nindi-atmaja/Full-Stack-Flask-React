# app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Initialize extensions without app instance
db = SQLAlchemy()

def create_app():
    """Application factory function"""
    app = Flask(__name__)
    
    # Configure app
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    # Initialize extensions with app
    CORS(app)
    db.init_app(app)
    
    # Register blueprints here (if any)
    # from .routes import main_bp
    # app.register_blueprint(main_bp)
    
    return app

# To be used when running the app directly (not via WSGI)
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)