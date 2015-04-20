$("#submitButton").live('click', function(){
    //disable the button so we can't resubmit while we wait
    //$("#submitButton",this).attr("disabled","disabled");
	var u = $("#email", this).val();
	var p = $("#password", this).val();
	if(u != '' && p!= '') {
		var mydata = $("form#loginForm").serialize();
		var _url = "http://"+server_url+"/mobilelogin/login?";
		console.log("URL:"+_url);
		$.ajax({
   			url: _url,
   			type: "GET", 
   			cache : false,
   			data: mydata,
   			error:   function(xhr, status, error) {
   				console.log(xhr);
   				console.log(status);
   				console.log(error);  
				navigator.notification.alert("Your login failed", function() {});
				//$.mobile.changePage("home.html");
				//window.location="home.html";
			},
   			success: function ( data, text, jqXhr ) { 
   				window.localStorage.setItem("patientData", JSON.stringify(data.patientResponse));
   				//if reminder is ON and reminder is present then show reminder
               //data.patientResponse.showReminder = false;
               if(data.patientResponse.showReminder){
   					$.mobile.changePage('#dialog', 'pop', true, true);
   				}else{
   					window.location="home.html";
   				}
   			}
		});
	}else{
		console.log("else");
	}
	return false;
});
$('#closeReminder').live('click', function () {
	window.location="home.html";
});

$("#dialog").live('pageshow', function(){
	var data = window.localStorage.getItem("patientData");
	data = JSON.parse(data);
	var rxRow = "";
	$.each(data.prescriptionHistories, function(index,item){
		//rxRow = rxRow+'<li><a href="#home">'+this.drugName+'</a></li>';
		rxRow = rxRow + '<ul data-role="listview" data-divider-theme="b" data-inset="true" id="reminderMsg'+index+'"><li data-role="list-divider" role="heading"><a data-role="button">'+this.drugName+' '+this.drugStrength+' '+this.drugForm+'</a></li></ul>'
	});
	$("#reminderMsg").html(rxRow);
	/*$.each(data.prescriptionHistories, function(index,item){
		$('#reminderMsg'+index).listview('refresh');
	});*/
});
