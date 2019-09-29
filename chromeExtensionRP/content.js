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
			
			console.log('made it here');

			if (typeof eventDetails != 'undefined') {
				chrome.runtime.sendMessage({"message": "retrieved_event_details", "eventDetails": eventDetails});
			} else {
				chrome.runtime.sendMessage({"message": "wrong_page"})
			}
			// Send response
			
   		}
	}
)

