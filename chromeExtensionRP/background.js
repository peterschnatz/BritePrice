// Show icon when navigate to Eventbrite page
chrome.tabs.onUpdated.addListener(function(id, info, tab){
    if ((tab.url.toLowerCase().indexOf("eventbrite.com/create") > -1) || (tab.url.toLowerCase().indexOf("eventbrite.com/edit") > -1)){
        chrome.pageAction.show(tab.id);
    }});



// Receive message from popup and send request for event details
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.message === "popup_request") {

			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				let activeTab = tabs[0];
				chrome.tabs.sendMessage(activeTab.id, {"message": "get_data"});
			})
		}
	});

// Receive event details from content and send to popup
chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse) {
		if (request.message === "retrieved_event_details") {
			console.log(request.eventDetails);
			chrome.runtime.sendMessage({"message":"get_ticket_info", "eventDetails": request.eventDetails})
		}
	});


// Send full details of event to AWS server to make prediction
chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse) {
		if (request.message === "send_to_model") {

			const fullDetails = {...request.eventDetails, ...request.ticketInfo};

            const proxyurl = "https://cors-anywhere.herokuapp.com/"
			// const proxyurl = "https://thawing-ridge-91933.herokuapp.com/"
			const url = "http://18.219.247.228"

			fetch(proxyurl + url, {
                mode: 'cors',
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify(fullDetails)
            })

            /* The commented content is for running locally

			const url = "http://localhost:5000"
			fetch(url, {
                mode: 'cors',
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify(fullDetails)
            })
            */

            .then(function(response) {
                if (!response.ok) throw response;
                else return response.text();
            })
            .then(function(text) {
                if(text) {
                    // Send model output to popup for display
                	chrome.runtime.sendMessage({"message": "ready_to_post", "suggestedPrice": text, "eventDetails": request.eventDetails})
                }
            })
            .catch(function(err) {
                console.error(`Fetch Error =\n`, err);
            });

}});

