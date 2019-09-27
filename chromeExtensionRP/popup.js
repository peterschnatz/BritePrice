// Extension begins to run by clicking icon
chrome.runtime.sendMessage({"message": "popup_request"});

// Receive event details from background and fill popup.html
chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse) {
		if (request.message === "ready_to_post") {

			document.getElementById("title").innerHTML = request.eventDetails.title;

			console.log(JSON.stringify(request.eventDetails))
			xhr = new XMLHttpRequest();
			xhr.open("POST","http://localhost:5000");
			//xhr.open("POST","http://18.219.247.228:5000")
			xhr.send(JSON.stringify(request.eventDetails));


			xhr.onreadystatechange = function() {
    			if (xhr.readyState == 4 && xhr.status == 200) {
    				 //Request was successful
    				//let jsonResponse = JSON.parse(xhr.responseText)
    				console.log(xhr.response)
    				document.getElementById("price").innerHTML = xhr.response
			

    			}
			};
			//document.getElementById("price").innerHTML = 'New stuff';
			//document.getElementById("title").innerHTML = request.eventDetails.title;



		}
	}
);



