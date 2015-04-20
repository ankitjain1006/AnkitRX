/*!
 NZQuake (c) Copyright Greg Smith
 */

var map;

function createQuakeEventMarker(quakeEventLatlng) {
    return new google.maps.Marker({position: quakeEventLatlng, map: map});
}

function setupMap(lat, lng, mapZoom, showOverviewControl) {
    var mapLatlng = new google.maps.LatLng(lat, lng);
    var myOptions = {
    zoom: mapZoom,
    center: mapLatlng,
    overviewMapControl: showOverviewControl,
    zoomControl: true,
    zoomControlOptions: {
    style: google.maps.ZoomControlStyle.SMALL,
    position: google.maps.ControlPosition.LEFT_TOP
        
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    alert(map);
}