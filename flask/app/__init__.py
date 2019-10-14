from flask import Flask
from flask_cors import CORS
flask_instance = Flask(__name__)
cors = CORS(flask_instance)
from app import routes