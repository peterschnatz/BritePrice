// Extension begins to run by clicking icon
chrome.runtime.sendMessage({"message": "popup_request"});



//Receive event details from background and fill popup.html
chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse) {
		if (request.message === "get_ticket_info") {

// This begins the new part
      // let inventoryType = ['Limited','Reserved'];
      // let optionsInv = "<option value=''>Choose...</option>"
      // for (let i = 0; i < inventoryType.length; i++) {
      //   optionsInv += "<option>"+ inventoryType[i] +"</option>";
      // }
      // document.getElementById("inventory").innerHTML = optionsInv;

      // let reservationType = ['Yes','No'];
      // let optionsRes = "<option value=''>Choose...</option>"
      // for (let i = 0; i < reservationType.length; i++) {
      //   optionsRes += "<option>"+ reservationType[i] +"</option>";
      // }
      // document.getElementById("reserved").innerHTML = optionsRes;

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
        // let invtype = document.getElementById('inventory').value;
        // let restype = document.getElementById('reserved').value;
        let waitl = document.getElementById('waitlist').value;
        let feedec = document.getElementById('fees').value;
        let refpol = document.getElementById('refunds').value;
        let maxtix = document.getElementById('maxtix').value
        let ticket_dict = {
          // 'invtype': invtype,
          // 'restype': restype,
          'waitl': waitl,
          'feedec': feedec,
          'refpol': refpol,
          'maxtix': maxtix
        }

        chrome.runtime.sendMessage({"message": "send_to_model","ticketInfo": ticket_dict,"eventDetails": request.eventDetails});
      });
    }});



      // console.log(template_dict);
      
// This ends the new part

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
      
chrome.runtime.onMessage.addListener(
  function(request,sender,sendResponse) {
    if (request.message === "ready_to_post") {
      console.log(request.suggestedPrice);
      console.log("that's the price");

      document.getElementById("suggest").innerHTML = "Suggested price for your event,"
      document.getElementById("price").innerHTML = request.suggestedPrice;
      document.getElementById("title").innerHTML = request.eventDetails.title;  


      // document.getElementById("tickets").addEventListener('submit',function() {
      //   setTimeout(function (){
      //     console.log('in the click')

      //     setTimeout(function (){
      //       let priceNew = request.suggestedPrice
      //       document.getElementById("price").innerHTML = priceNew;
      //       console.log('this one' + priceNew)
      //     },2000)

      //   }, 2000);
        
      // })
    }
  }
);

