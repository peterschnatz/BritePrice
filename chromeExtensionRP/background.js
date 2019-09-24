// Receive message from popup and send request for event details
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.message === "popup_request") {

			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				let activeTab = tabs[0];
				chrome.tabs.sendMessage(activeTab.id, {"message": "get_data"});
			})
		}
	})

// Receive event details from content and send to popup
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.message === "retrieved_event_details") {
			console.log(request.eventDetails);

			chrome.runtime.sendMessage({"message": "ready_to_post", "eventDetails": request.eventDetails})
		}
	}
);