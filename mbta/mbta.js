// Patrick Zwierzynski

//used in createMap function to differentiate closures
//-- code referenced: https://stackoverflow.com/questions/2670356/...
//                    looping-through-markers-with-google-maps-api-v3-problem
function makeWindow(map, infowindow, marker) {
  return function() {
    infowindow.open(map, marker);
  };
}
// -- Uses google map API to display map
function createMap () {
  // HARD-CODED STATION COORDS
  var station = [];
  station[0] = {lat: 42.352271, lng: -71.05524200000001};
  station[1] = {lat: 42.330154, lng: -71.057655};
  station[2] = {lat: 42.3884, lng: -71.11914899999999};
  station[3] = {lat: 42.373362, lng: -71.118956};
  station[4] = {lat: 42.320685, lng: -71.052391};
  station[5] = {lat: 42.31129, lng: -71.053331};
  station[6] = {lat: 42.35639457, lng: -71.0624242};
  station[7] = {lat: 42.342622, lng: -71.056967};
  station[8] = {lat: 42.275275, lng: -71.029583};
  station[9] = {lat: 42.29312583, lng: -71.06573796000001};
  station[10] = {lat: 42.39674, lng: -71.121815};
  station[11] = {lat: 42.395428, lng: -71.142483};
  station[12] = {lat: 42.36249079, lng: -71.08617653};
  station[13] = {lat: 42.361166, lng: -71.070628};
  station[14] = {lat: 42.355518, lng: -71.060225};
  station[15] = {lat: 42.251809, lng: -71.005409};
  station[16] = {lat: 42.233391, lng: -71.007153};
  station[17] = {lat: 42.284652, lng: -71.06448899999999};
  station[18] = {lat: 42.2665139, lng: -71.0203369};
  station[19] = {lat: 42.300093, lng: -71.061667};
  station[20] = {lat: 42.365486, lng: -71.103802};
  station[21] = {lat: 42.2078543, lng: -71.0011385};
  //STATION NAMES IN PARALLEL ARRAY
  var names = [];
  names[0] = "South Station";
  names[1] = "Andrew";
  names[2] = "Porter Square";
  names[3] = "Harvard Square";
  names[4] = "JFK/UMass";
  names[5] = "Savin Hill";
  names[6] = "Park Street";
  names[7] = "Broadway";
  names[8] = "North Quincy";
  names[9] = "Shawmut";
  names[10] = "Davis";
  names[11] = "Alewife";
  names[12] = "Kendall/MIT";
  names[13] = "Charles/MGH";
  names[14] = "Downtown Crossing";
  names[15] = "Quincy Center";
  names[16] = "Quincy Adams";
  names[17] = "Ashmont";
  names[18] = "Wollaston";
  names[19] = "Fields Center";
  names[20] = "Central Square";
  names[21] = "Braintree";

  //Create Map and Marker Loop
  var map = new google.maps.Map(document.getElementById('map'), {
    center: station[0],
    zoom: 13
  });

  var xml = new XMLHttpRequest();
  xml.open("GET", "https://patzwi-mbta.herokuapp.com/redline.json", true);
  xml.onreadystatechange = function() {
    if ((xml.readyState == 4) && (xml.status == 200)) {
        //console.log("response received");
        var jsonData = JSON.parse(xml.responseText);
        info_stat = new Array(22);
        for (var i in names) {
          info_stat[i] = "<h2>Upcoming Trains for " + names[i] + ":</h2>";
        }
        for (var i in jsonData.TripList.Trips) {
          for (var j in jsonData.TripList.Trips[i].Predictions) {
            for (var k in names) {
              if (jsonData.TripList.Trips[i].Predictions[j].Stop == names[k]) {
                var info_string = "<p>Train towards " +
                jsonData.TripList.Trips[i].Destination + " arriving in " +
                jsonData.TripList.Trips[i].Predictions[j].Seconds +
                " seconds</p>";
                info_stat[k] += info_string;
              }
            }
          }
        }
        var marker_info = [];
        for (var i in station) {
          marker_info[i] = new google.maps.InfoWindow ({
            content: info_stat[i]
          });
          google.maps.event.addListener(marker[i], "click",
                                        makeWindow(map, marker_info[i], marker[i]));
        }
      }
  }
  xml.send();

  var image = {
    url: "mbta.png",
    scaledSize: new google.maps.Size(22,22)
  };

  var marker = new Array(22);
  for (var i in station) {
    marker[i] = new google.maps.Marker({
      map: map,
      position: station[i],
      title: names[i],
      icon: image
    });
  }

    var redLine = new Array(3);
    //route from alewife to JFK/UMASS
    redLine[0] = [
      station[11],
      station[10],
      station[2],
      station[3],
      station[20],
      station[12],
      station[13],
      station[6],
      station[14],
      station[0],
      station[7],
      station[1],
      station[4]
    ];
    //Route 2 seperate lines at the JFK/UMASS fork
    redLine[1] = [
      station[4],
      station[5],
      station[19],
      station[9],
      station[17]
    ];

    redLine[2] = [
      station[4],
      station[8],
      station[18],
      station[15],
      station[16],
      station[21]
    ];
    //Add polylines to map
    var track = new Array(3);
    for (var i in redLine) {
        track[i] = new google.maps.Polyline({
        path: redLine[i],
        geodesic: true,
        strokeColor: "red",
        strokeWeight: 5
      });
        track[i].setMap(map);
    }

    // Checks current location and adds marker to map
    var image2 = {
      url: "person.png",
      scaledSize: new google.maps.Size(26,26)
    };

    navigator.geolocation.getCurrentPosition(function(position) {
     var loc = {lat: position.coords.latitude, lng: position.coords.longitude};
     document.getElementById("usercoordslat").value = loc.lat;
     document.getElementById("usercoordslng").value = loc.lng;
     document.getElementById("form").submit();
     var loc_mark = new google.maps.Marker({
       map: map,
       position: loc,
       title: "You are here",
       icon: image2
     });

     //convert to latlng obj.
     var myLoc = new google.maps.LatLng(loc.lat, loc.lng);
     var min_distance = Number.MAX_SAFE_INTEGER; //initialize val.
     var min_index = -1; //initialize val.
     for (var i in station) {
       var station_loc = new google.maps.LatLng(station[i].lat, station[i].lng);
       var dist = google.maps.geometry.spherical.computeDistanceBetween(station_loc, myLoc);
       if (dist < min_distance) {
         min_distance = dist;
         min_index = i;
       }
     }

     var info_window_text = "<h2> Your Current Location </h2>" +
     "<p>Closest MBTA station: " + names[min_index] + "</p>" +
     "<p>Distance away (in miles): " + (min_distance/1609.34).toFixed(2) +
     "</p>";

     var info_win = new google.maps.InfoWindow ({
       content: info_window_text
     });

     loc_mark.addListener("click", function(){
       info_win.open(map, loc_mark);
     });

     var station_route = new google.maps.Polyline ({
       path: [loc, station[min_index]],
       geodesic: true,
       strokeColor: "blue",
       strokeWeight: 5
     });
     station_route.setMap(map);
    });
}
