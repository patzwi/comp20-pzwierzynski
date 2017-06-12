// Patrick Zwierzynski
// -- Uses google map API to display map
function createMap () {
  alert('Hacked')
  var southStation = {lat: 42.352271, lng: -71.055242};
  var map = new google.maps.Map(document.getElementById('map'), {
    center: southStation,
    zoom: 11
  });
}
