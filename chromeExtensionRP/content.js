/*alert("Hello from your Chrome extension!");

let firstHref = $("a[href^='http']").eq(0).attr("href");

console.log(firstHref);
*/

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.message === "clicked_browser_action") {
			
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

			console.log(eventDetails);
   		}
	}
)

