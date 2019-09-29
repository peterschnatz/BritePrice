from app import flask_instance
from flask import Flask, request, jsonify, render_template, url_for
from joblib import load
from app.a_Model import ModelIt

@flask_instance.route('/', methods=['POST', 'GET'])
@flask_instance.route('/index', methods=['POST', 'GET'])
def form_example():
	if request.method == 'POST':  #this block is only entered when the form is submitted
		# print(request)



# This is new stuff. Everything above works
		data = request.get_json(force=True)


		invtype = request.form.get('invtype')
		restype = request.form.get('restype')
		waitl = request.form.get('waitl')
		feedec = request.form.get('decision')
		refpol = request.form.get('ref')

		template_dict = {
			'invtype': invtype,
			'restype': restype,
			'waitl': waitl,
			'feedec': feedec,
			'refpol': refpol 
		}
		print(template_dict['invtype'])
		print(restype)
        
        #### Model goes here 
		print('here')
		theResult = round(float(ModelIt(data)),2)
		print('here2')
		print(theResult)
		return '$%.2f' %theResult


    
        ### model output goes here
    #     template_dict = {
    #         'invtype': invtype,
    #         'restype': restype,
    #         'waitl': waitl,
    #         'feedec': feedec,
    #         'refpol': refpol 
    #         }
    #     return render_template('test_results.html', **template_dict)
    
    #     # return '''<h1>The language value is: {}</h1>
    #     #           <h1>The framework value is: {}</h1>
    #     # <h1>Color selected: {} </h1>'''.format(language, framework, color)
    # print('hi 1')

	# inventoryType = ['limited','reserved']
	# reservedSeating = ['yes','no']
	# waitlist = ['yes','no']
	# fees = ['included','not included']
	# refunds = ['no refunds','1 day','7 days','30 days']


	# return render_template('popup.html', inventoryType=inventoryType,reservedSeating=reservedSeating,
	# 	waitlist=waitlist,fees=fees,refunds=refunds)




# This was working before
		# print('in routes')
		# data = request.get_json(force=True)
		# theResult = round(float(ModelIt(data)),2)
		# print(theResult)
		# return '$' + str(theResult)
        

