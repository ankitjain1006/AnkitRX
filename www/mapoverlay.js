var map;function createQuakeOverlay(c,a){overlayColor=getOverlayColor(a);var b=new google.maps.Circle({map:map,fillColor:overlayColor,fillOpacity:0.4,strokeColor:overlayColor,strokeOpacity:0.8,strokeWeight:1,center:c,radius:a*a*a*a*10})}function createQuakeEventMarker(b,a){return new google.maps.Marker({position:b,map:map,title:"Near "+a})}function getMapIcon(a){if(a>=5){return""}else{if(a<5&a>=3){return"_orange"}else{return"_green"}}}function getOverlayColor(a){if(a>=5){return"#CD5C5C"}else{if(a<5&a>=3){return"#FF9900"}else{return"#21610B"}}}function setupMap(f,c,e,b){var d=new google.maps.LatLng(f,c);var a={zoom:e,center:d,scaleControl:true,overviewMapControl:b,mapTypeId:google.maps.MapTypeId.ROADMAP};map=new google.maps.Map(document.getElementById("map_canvas"),a);map.setOptions(a);if((navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPod/i))){map.panBy(0,100)}};
