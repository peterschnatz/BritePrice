// Extension begins to run by clicking icon
chrome.runtime.sendMessage({"message": "popup_request"});



//Receive event details from background and get ticket info from user then send to background to send to model
chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse) {
		if (request.message === "get_ticket_info") {


      let waitlistType = ['Yes','No'];
      let optionsWL = "<option value=''>Choose...</option>"
      for (let i = 0; i < waitlistType.length; i++) {
        optionsWL += "<option>"+ waitlistType[i] +"</option>";
      }
      document.getElementById("waitlist").innerHTML = optionsWL;


      let feesType = ['Included','Not included'];
      let optionsFee = "<option value=''>Choose...</option>"
      for (let i = 0; i < feesType.length; i++) {
        optionsFee += "<option>"+ feesType[i] +"</option>";
      }
      document.getElementById("fees").innerHTML = optionsFee;

      let refType = ['No refunds','1 day','7 days','30 days','No policy'];
      let optionsRef = "<option value=''>Choose...</option>"
      for (let i = 0; i < refType.length; i++) {
        optionsRef += "<option>"+ refType[i] +"</option>";
      }
      document.getElementById("refunds").innerHTML = optionsRef;

      let tixnum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      let optionsMaxtix = "<option value=''>Choose...</option>"
      for (let i = 0; i < tixnum.length; i++) {
        optionsMaxtix += "<option>"+ tixnum[i] +"</option>";
      }
      document.getElementById("maxtix").innerHTML = optionsMaxtix;



      let form = document.getElementById('tickets');
      form.addEventListener('submit', function(e){
        e.preventDefault();
        let waitl = document.getElementById('waitlist').value;
        let feedec = document.getElementById('fees').value;
        let refpol = document.getElementById('refunds').value;
        let maxtix = document.getElementById('maxtix').value
        let ticket_dict = {
          'waitl': waitl,
          'feedec': feedec,
          'refpol': refpol,
          'maxtix': maxtix
        }

        chrome.runtime.sendMessage({"message": "send_to_model","ticketInfo": ticket_dict,"eventDetails": request.eventDetails});
      });
    }});



// function wait(ms){
//    var start = new Date().getTime();
//    var end = start;
//    while(end < start + ms) {
//      end = new Date().getTime();
//   }
// }

// Display model suggested price to user      
chrome.runtime.onMessage.addListener(
  function(request,sender,sendResponse) {
    if (request.message === "ready_to_post") {
      console.log(request.suggestedPrice);
      console.log("that's the price");

      document.getElementById("suggest").innerHTML = "Suggested price for your event,"
      document.getElementById("price").innerHTML = request.suggestedPrice;
      document.getElementById("title").innerHTML = request.eventDetails.title;  
    }
  }
);

