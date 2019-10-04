from app import flask_instance
from flask import Flask, request, jsonify, render_template, url_for
from joblib import load
from app.a_Model import ModelIt

@flask_instance.route('/', methods=['POST', 'GET'])
@flask_instance.route('/index', methods=['POST', 'GET'])
def form_example():
	if request.method == 'POST':  #this block is only entered when the form is submitted
		# print(request)



# This is new stuff. Everything above 
		data = request.get_json(force=True)

		print(data)
        #### Model goes here 
		print('here')
		theResult = round(float(ModelIt(data)),2)
		print('here2')
		print(theResult)
		return '$%.2f' %theResult
        

