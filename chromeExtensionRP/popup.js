// Extension begins to run by clicking icon
chrome.runtime.sendMessage({"message": "popup_request"});

// Receive event details from background and fill popup.html
chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse) {
		if (request.message === "ready_to_post") {
			document.getElementById("price").innerHTML = 'New stuff';
			document.getElementById("title").innerHTML = request.eventDetails.title;
		}
	}
);



