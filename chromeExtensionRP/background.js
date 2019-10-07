chrome.tabs.onUpdated.addListener(function(id, info, tab){
    if ((tab.url.toLowerCase().indexOf("eventbrite.com/create") > -1) || (tab.url.toLowerCase().indexOf("eventbrite.com/edit") > -1)){
    	console.log("got in")
    	console.log(tab.id)
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


chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse) {
		if (request.message === "retrieved_event_details") {
			console.log(request.eventDetails);
			chrome.runtime.sendMessage({"message":"get_ticket_info", "eventDetails": request.eventDetails})
		}
	});



chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse) {
		if (request.message === "send_to_model") {

			const fullDetails = {...request.eventDetails, ...request.ticketInfo};

			const proxyurl = "https://thawing-ridge-91933.herokuapp.com/"
			const url = "http://18.219.247.228"

			fetch(proxyurl + url, {
                mode: 'cors',
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify(fullDetails)
            })

			// const url = "http://localhost:5000"
			// fetch(url, {
   //              mode: 'cors',
   //              method: 'post',
   //              headers: { "Content-type": "application/json; charset=UTF-8" },
   //              body: JSON.stringify(fullDetails)
   //          })

            .then(function(response) {
                if (!response.ok) throw response;
                else return response.text();
            })
            .then(function(text) {
                if(text) {
                	console.log(text);
                	chrome.runtime.sendMessage({"message": "ready_to_post", "suggestedPrice": text, "eventDetails": request.eventDetails})
                }
            })
            .catch(function(err) {
                console.error(`Fetch Error =\n`, err);
            });

}});

