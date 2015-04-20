function onloadfunc(){
    var data = window.localStorage.getItem("patientData");
    data = JSON.parse(data);
    //$("#welcomenote").html("Welcome <b>"+data.firstName+" "+data.lastName+"</b>. This is your personalized <em>Home</em> page");
    $("#welcomenote").html("Welcome <b>"+data.firstName+" "+data.lastName+"</b>");
    var dynatext = $("#click_to_call").html();
    //$("#click_to_call").html(dynatext + " <sup>New</sup>");
}

function onLogout(){
    navigator.notification.confirm(
        'Do you want to logout?',  // message
        onLogoutConfirm,              // callback to invoke with index of button pressed
        'Confirm Logout',            // title
        'Yes,No'          // buttonLabels
    );
    return false;
}

function onLogoutConfirm(buttonIndex) {
    if(buttonIndex == 1){
        window.localStorage.clear();
        window.location="index.html";
    }else{
        return false;
    }
}

function onClickManageProfile(){
    var data = window.localStorage.getItem("patientData");
    data = JSON.parse(data);
    $("#membernumber").val(data.patientId);
    $("#firstName").val(data.firstName);
    $("#lastName").val(data.lastName);
    $("#dob").val(data.dob);
    $("#email").val(data.email);
    $("#phone").val(data.phone);
    $("#street1").val(data.street1);
    $("#street2").val(data.street2);
    $("#city").val(data.city);
    $("#state").val(data.state);
    $("#zip").val(data.zip);
    $("#password").val(data.password);
    $("#patientId").val(data.patientId);
    $.mobile.changePage($("#manage_profile_page"));
}

function onClickPrescriptionHistoryList(){
    var data = window.localStorage.getItem("patientData");
	data = JSON.parse(data);
	var _url="http://"+server_url+"/history/patientHistory?patientId="+data.patientId;
	console.log("URL: "+_url);
	$.ajax({
           url: _url,
           type: "GET",
           cache : false,
           dataType: 'json',
           error:   function(xhr, status, error) {
           navigator.notification.alert("Profile update failed!", function() {});
           },
           success: function ( data, text, jqXhr ) {
           var rxList = data.prescriptionHistoryList;
           console.log(JSON.stringify(rxList));
           window.localStorage.setItem("rxhistorylist", JSON.stringify(rxList));
           var rxRow = "";
           $.each(rxList, function(index,item){
                  console.log("Monu: "+this.drugName);
                  rxRow = rxRow+'<li><a href="#" onclick="showPrescriptionDetails('+this.rxNumber+')">'+this.drugName+' '+this.drugForm+' '+this.drugStrength+'</a></li>';
            });
           console.log("Monu: --->"+rxRow);
           $("#rx_history_list").html(rxRow);
           $('#rx_history_list').listview('refresh');
           }
    });
	$.mobile.changePage("#prescription_history_list_page");
}

function showPrescriptionDetails(rxNumber){
    //console.log(rxNumber);
    //console.log(window.localStorage.getItem("rxhistorylist"));
    var rxList = JSON.parse(window.localStorage.getItem("rxhistorylist"));
    //console.log(rxList);
    // @TODO find the row based on the rx number in the list
    $.each(rxList, function(index,item){
           if(this.rxNumber == rxNumber){
                $("#rxnumber").val(this.rxNumber);
                $("#drugName").val(this.drugName);
                $("#ndc").val(this.ndc);
                $("#drugStrength").val(this.drugStrength);
                $("#drugForm").val(this.drugForm);
                $("#manufacturer").val(this.manufacturer);
                $("#prescriberName").val(this.prescriberFirstName+' '+this.prescriberLastName);
                $("#rxWrittenDate").val(this.rxWrittenDate);
                $("#rxExpireDate").val(this.rxExpireDate);
                $("#qtyDispensed").val(this.qtyDispensed);
                $("#qtyRemaining").val(this.qtyRemaining);
                $("#noOfRefills").val(this.noOfRefills);
                $("#refillsRemaining").val(this.refillsRemaining);
                $("#patientPay").val(this.patientPay);
           
           }
    });
    $.mobile.changePage($("#prescription_history_page"));
    
}

function showDrugInformation(){
    $.mobile.changePage("#drug_info_page");
}

function showDrugSearchResults(){
    var searchText = $('#searchDrug').val();
	//console.log("Monu......................."+ searchText);
	//@TODO perform validation
	var _url = "http://pillbox.nlm.nih.gov/PHP/pillboxAPIService.php?key=&ingredient="+searchText;
	//console.log(_url);
	$.mobile.showPageLoadingMsg();
	$.ajax({
           url: _url,
           type: "GET",
           cache : false,
           dataType: "text",
           error:   function(xhr, status, error) {
           //console.log(xhr);
           //console.log(status);
           //console.log(error);
           navigator.notification.alert("Could not retrieve data from pillbox !", function() {});
            $.mobile.hidePageLoadingMsg();
           },
           success: function ( txt, text, jqXhr ) {
                var xml = $.parseXML(txt);
                $("#searchResults").html("Search Results : "+$(xml).find('record_count').text()+" records found");
                var result_list = "";
                window.localStorage.setItem("searchData", txt);
                $(xml).find('pill').each(function(){
                    var _ndc = $(this).find('NDC9').text();
                    result_list = result_list+'<li><a href="#" onclick="showDrugDetails('+_ndc+')">'+$(this).find('RXSTRING').text()+'</a></li>';
                });
                $("#search_result_list").html(result_list);
                $('#search_result_list').listview('refresh');
                $.mobile.hidePageLoadingMsg();
           }
    });
}

function showDrugDetails(ndc){
    console.log(ndc);
    var xml = window.localStorage.getItem("searchData");
	$(xml).find('pill').each(function(){
        if($(this).find('NDC9').text() == ndc){
            var _imageurl = "";
            if($(this).find('HAS_IMAGE').text() == 1){
                _imageurl = "http://pillbox.nlm.nih.gov/assets/small/"+$(this).find('image_id').text()+"sm.jpg";
            }
            $("#imageUrl").attr("href",_imageurl);
            $("#imageId").attr("src",_imageurl);
            $("#searchDrugName").attr("value",$(this).find('RXSTRING').text());
            $("#searchManufacturer").attr("value",$(this).find('AUTHOR').text());
            $("#searchNDC").attr("value",$(this).find('NDC9').text());
        }
    });
    $.mobile.changePage($("#drug_details_page"));
}

function showClickToCall(){
    var data = window.localStorage.getItem("patientData");
	data = JSON.parse(data);
	var _url="http://"+server_url+"/prescriber?patientId="+data.patientId;
	console.log("URL: "+_url);
	$.ajax({
           url: _url,
           type: "GET",
           cache : false,
           dataType: 'json',
           error:   function(xhr, status, error) {
                navigator.notification.alert("Failed to retrieve Prescriber information!", function() {});
           },
           success: function ( data, text, jqXhr ) {
                var docList = data.prescriberList;
            //console.log(JSON.stringify(rxList));
           //window.localStorage.setItem("rxhistorylist", JSON.stringify(rxList));
                var docRow = "";
                var docOptions ="<option>Select</option>";
                /*$.each(docList, function(index,item){
                  docOptions = docOptions + '<option value="'+this.phoneNumber+'">'+this.prescriberFirstName+' '+this.prescriberLastName+'</option>';
                });*/
                $("#doctor_number").html(docOptions);
           //console.log("Monu: --->"+rxRow);
           //$("#rx_history_list").html(rxRow);
           //$('#rx_history_list').listview('refresh');
           }
    });
    var docOptions ="<option value='1234'>Monu</option><option value='4545454'>Ani</option>";
    $("#doctor_number").html(docOptions);
	$.mobile.changePage("#click2call_page");
}

function onChangeDoctor(){
    var _docNo = $("#doctor_number").val();
    $("#number2call").val(_docNo);
}

function asdf(){
    //alert("asdfasdfasdf");
    var _docNo = $("#number2call").val();
    window.plugins.phoneDialer.dial('1-800-555-1234');
    //window.location.href = "tel:"+_docNo;
}

function showRefillReminder(){
    var data = window.localStorage.getItem("patientData");
	data = JSON.parse(data);
	$("#refillPatientId").val(data.patientId);
	var daysoptions ="<option>Select</option>";
	var reminderdays = data.daysOfReminder;
	for(var i=5; i< 25; i=i+5){
		if(i==reminderdays){
			daysoptions = daysoptions + '<option selected="selected" value="'+i+'">'+i+'</option>';
		}else{
			daysoptions = daysoptions + '<option value="'+i+'">'+i+'</option>';
		}
	}
    
	$("#days").html(daysoptions);
	var _reminderFlag = data.reminderFlag;
	if( _reminderFlag == 'N')
		var reminderflagOptions ='<option selected="selected" value="N">OFF</option><option value="Y">ON</option>';
	else
		var reminderflagOptions ='<option value="N">OFF</option><option selected="selected" value="Y">ON</option>';
	$("#reminderflag").html(reminderflagOptions);
	$.mobile.changePage($("#reminder_refill_page"));
}

function saveRefillReminder(){
    var _days = $("#days").val();
    var _patientId = $("#refillPatientId").val();
    var _reminderflag = $("#reminderflag").val();
    //console.log(_days+"********"+_patientId+"*********"+_reminderflag);
    var _url = "http://"+server_url+"/refillreminder/savereminder?days="+_days+"&patientId="+_patientId+"&reminderflag="+_reminderflag;
    //console.log("URL:"+_url);
    $.ajax({
           url: _url,
           type: "GET",
           cache : false,
           error:   function(xhr, status, error) {
           navigator.notification.alert("Error updating Refill Reminder!", function() {});
           },
           success: function ( data, text, jqXhr ) {
            console.log(data.refillReminder);
            window.localStorage.setItem("refillReminder", JSON.stringify(data.refillReminder));
            navigator.notification.alert("Refill reminder is updated successfully!", function() {});
           }
    });
}

function showRefillOrder(){
    var data = window.localStorage.getItem("patientData");
	data = JSON.parse(data);
	$("#orderPatientId").val(data.patientId);
	var drugOptions ="<option>Select one Prescription</option>";
	$.each(data.prescriptionHistories, function(index,item){
           drugOptions = drugOptions + '<option value="'+this.rxNumber+'">'+this.drugName +' '+this.drugStrength+' '+this.drugForm+'</option>';
           });
    
	$("#drugs_name").html(drugOptions);
	$.mobile.changePage($("#refill_order_page"));
}

function onChangeRx(){
    var data = window.localStorage.getItem("patientData");
    data = JSON.parse(data);
    var _rxNumber = $("#drugs_name").val();
    $.each(data.prescriptionHistories, function(index,item){
        if(this.rxNumber == _rxNumber){
           $("#orderRxNumber").val(this.rxNumber);
           $("#orderDaysSupply").val(this.daysSupply);
           $("#orderQuantity").val(this.qtyDispensed);
           $("#orderPatientPay").val("$"+this.patientPay);
           $("#orderQuantity").val(this.qtyDispensed);
           $("#orderNDC").val(this.ndc);
           $("#orderNoOfRefills").val(this.noOfRefills);
           $("#orderRefillsRemaining").val(this.refillsRemaining);
        }
    });
    
}

function saveRefillOrder(){
    var mydata = $("form#refill_order_form").serialize();
    var _rxNumber = $("#drugs_name").val();
    var _daysSupply = $("#orderDaysSupply").val();
    var _quantity = $("#orderQuantity").val();
    //alert(_rxNumber+"********"+_daysSupply+"*********"+_quantity);
    var _url = "http://"+server_url+"/rx/rxorder?rxNumber="+_rxNumber+"&daysSupply="+_daysSupply+"&quantity="+_quantity;
    console.log("URL:"+_url);
    $.ajax({
           url: _url,
           type: "GET",
           cache : false,
           error:   function(xhr, status, error) {
           navigator.notification.alert("Error in placing the order!", function() {});
           },
           success: function ( data, text, jqXhr ) {
           window.localStorage.setItem("rxhistorylist", JSON.stringify(data.prescriptionHistoryList));
           navigator.notification.alert("Order has been placed successfully!", function() {});
           }
    });
}

function searchPhamacy(){
    var search = $("#search").val();
	search += " pharmacy";
	search = search.replace(" ","+")
	$.mobile.showPageLoadingMsg();
	$.ajax({
           type : "GET",
           url: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
           data: {
           sensor: true,
           query: search,
           key: "AIzaSyD-FpqXDALUgNXIESOBJCqjoOPMiLXhixg",
           types: "pharmacy",
           
           },
           timeout : 10000,
           cache : true,
           dataType : "JSON",
           error : OnError,
           success : OnSuccess
           
    });
}

function OnSuccess(data, status) {
	window.localStorage.setItem("mapdata", JSON.stringify(data));
	if (data.status == "OK" ){
		var places	= new Array();
		var ids		= new Array();
		$.each(data.results, function(key,val){
               places.push(val.formatted_address);
               ids.push(val.id);
               });
		addListElements(places,ids);
	} else if ( data.status == "ZERO_RESULTS") {
		// show no record found
		$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, "No Record found", true );
		setTimeout( $.mobile.hidePageLoadingMsg, 1500 );
	}	else {
		// show error message
		$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true );
		setTimeout( $.mobile.hidePageLoadingMsg, 1500 );
	}
    $.mobile.hidePageLoadingMsg();
}

function OnError(request, status, error) {
	// show error message
	$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true );
	setTimeout( $.mobile.hidePageLoadingMsg, 1500 );
}

function addListElements(places,ids) {
    str = '';
    $.each(places, function(i,p){
           //str += '<li><a href="#basic_map" onclick="showPharmacyInMap(\''+ids[i]+'\')" >'+ p +'</a></li>';
           str += '<li><a href="map.html?id='+ids[i]+'" data-ajax="false" rel="external">'+ p +'</a></li>';
           
           //console.log(" sandeep " + str );
           });
    $("#searchplaces").html(str);
    $("#searchplaces").listview('refresh');
}

function showPharmacyInMap(id){
    console.log("id"+id);
    var name;
	var lat;
	var lng;
	var mapdata = JSON.parse(window.localStorage.getItem("mapdata"));
	
	$.each(mapdata.results, function(key,val){
           if( id == val.id  ){
            lat = val.geometry.location.lat;
            lng = val.geometry.location.lng
            name = val.name;
           }
    });
    
    
	console.log(" MAPDETAILS "	+ id + " lat  "+lat + " lng "+ lng + "name "+ name);

    
    cor =  lat+','+lng
	var mobileDemo = { 'center': cor, 'zoom': 10 };
	
	////////////////////////////////////////////////////////////
    
	demo.add('basic_map', function() {
             $('#map_canvas').gmap({'center': mobileDemo.center, 'zoom': mobileDemo.zoom, 'disableDefaultUI':true, 'callback': function() {
                                   var self = this;
                                   self.addMarker({'position': this.get('map').getCenter() }).click(function() {
                                                                                                    self.openInfoWindow({ 'content': name }, this);
                                                                                                    });
                                   }}); 
             }).load('basic_map');
	
	demo.add('basic_map', function() { $('#map_canvas').gmap('refresh'); }).load('basic_map');
    return true;
}
