#!/usr/bin/env python3
print("========================================")
print("Website should at http://localhost:5000/")
print("========================================")
print("\n")

from app import flask_instance

flask_instance.run(debug=True, host='0.0.0.0')