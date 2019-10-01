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
			console.log('Im here********');
			console.log(request.eventDetails);
			chrome.runtime.sendMessage({"message":"get_ticket_info", "eventDetails": request.eventDetails})
		}
	});



chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse) {
		if (request.message === "send_to_model") {

			const fullDetails = {...request.eventDetails, ...request.ticketInfo};


			const proxyurl = "https://cors-anywhere.herokuapp.com/";
			const url = "http://18.219.247.228"
			// const url = "http://127.0.0.1:8000"

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




// chrome.runtime.onMessage.addListener(
// 	function(request,sender,sendResponse) {
// 		if (request.message === "retrieved_event_details") {

// 			//document.getElementById("title").innerHTML = request.eventDetails.title;

// 			console.log(JSON.stringify(request.eventDetails));

// 			const proxyurl = "https://cors-anywhere.herokuapp.com/";
// 			const url = "http://18.219.247.228:5000"

// 			fetch(proxyurl + url, {
//                 mode: 'cors',
//                 method: 'post',
//                 headers: { "Content-type": "application/json; charset=UTF-8" },
//                 body: JSON.stringify(request.eventDetails)
//             })
//             .then(function(response) {
//                 if (!response.ok) throw response;
//                 else return response.text();
//             })
//             .then(function(text) {
//                 if(text) {
//                 	console.log(text);
//                 	chrome.runtime.sendMessage({"message": "ready_to_post", "suggestedPrice": text, "eventDetails": request.eventDetails})
//                 }
//             })
//             .catch(function(err) {
//                 console.error(`Fetch Error =\n`, err);
//             });

//             //console.log(response.text())
//             // chrome.runtime.sendMessage({'message':'ready_to_post','suggestedPrice':response.tex})
// }});