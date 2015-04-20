// get called when map.html will be loaded
$(document).delegate("#map", 'pageinit', function (event) {
                     onMapLoad();
                     });

function onMapLoad(){
    console.log("*onMapLoad*");
    if(navigator.network.connection.type != Connection.NONE) {
        // internet available
        
        var fileref = document.createElement('script');
        fileref.setAttribute('type', 'text/javascript');
        // getGeolocation get fired when google maps api script loaded successfully
        fileref.setAttribute('src', 'http://maps.googleapis.com/maps/api/js?sensor=true&callback=getGeolocation');
        document.getElementsByTagName('head')[0].appendChild(fileref);
    } else {
        alert('Internet Connection not available.')
    }
}

function getGeolocation(){
    console.log("*getGeolocation*");
    var options = {
    maximumAge: 600000,         // We accept positions whose age is not greater than 10 minutes.
    timeout: 30000,             // if there is no cached position available at all, the user agent
        // will immediately invoke the error callback after "timeout" 30 seconds
    enableHighAccuracy: false   // true, if you need high accuracy
    };
    // when the geolocation is successfully received, loadMap will be fired
    navigator.geolocation.getCurrentPosition(loadMap, geoError, options);
}

function loadMap(position){
    console.log("*loadMap*: " + position.coords.latitude + ' ' + position.coords.longitude);
    var latlng = new google.maps.LatLng(
                                        position.coords.latitude, position.coords.longitude);
    var myOptions = {
    zoom: 12,           // zoom level. more value = more details
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var mapObj = document.getElementById("map_canvas");
    var map = new google.maps.Map(mapObj, myOptions);
    
    // marker will be displayed on the lat long position
    var marker = new google.maps.Marker({
                                        position: latlng,
                                        map: map
                                        });
}

function geoError(err) {
    console.log("*geoError*");
    alert('code: ' + err.code + '\n' + 'message: ' + err.message + '\n');
}