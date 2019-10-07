// Receive message from background and send event details back
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.message === "get_data") {

			let eventForm = document.getElementById('event_form');
			let eventInputs = new FormData(eventForm);

			const eventDetails = {
				'title': eventInputs.get('group-details-name'),
				'city': eventInputs.get('group-location-city'),
				'state': eventInputs.get('group-location-state'),
				'zip': eventInputs.get('group-location-postal_code'),

				'eventStart': eventInputs.get('group-details-start_date'),
				'eventEnd': eventInputs.get('group-details-end_date'),
				'timeZone': eventInputs.get('group-timezone-timezone_string'),

				'format': eventInputs.get('group-privacy_and_promotion-event_format'),
				'category': eventInputs.get('group-privacy_and_promotion-event_category'),
				'subcategory': eventInputs.get('group-privacy_and_promotion-event_subcategory')
			};

			if ((document.getElementById('create_location_content').getElementsByTagName('span')[0]) || (eventDetails['zip'] === "")){
				eventDetails['online'] = 1;
			} else {
				eventDetails['online'] = 0;
			}

			if (eventDetails['zip'] === "") {
				eventDetails['zip'] = 'online'
			}
			
			console.log(eventDetails['online'])
			console.log('made it here');

			if (typeof eventDetails !== 'undefined') {
				chrome.runtime.sendMessage({"message": "retrieved_event_details", "eventDetails": eventDetails});
			} else {
				chrome.runtime.sendMessage({"message": "wrong_page"})
			}
			
   		}
	}
);

