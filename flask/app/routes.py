from app import flask_instance
from flask import Flask, request, jsonify, render_template, url_for
from joblib import load
from app.a_Model import ModelIt

@flask_instance.route('/', methods=['POST', 'GET'])
@flask_instance.route('/index', methods=['POST', 'GET'])
def form_example():
	if request.method == 'POST':  

		# Assign data
		data = request.get_json(force=True)

		# Use model to output suggested ticket price based on data
		theResult = round(float(ModelIt(data)),2)

		# Return suggested ticket price
		return '$%.2f' %theResult
        

