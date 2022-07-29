// Initialize and add the map
let map;

function initMap() {
    // The location of Uluru
    const uluru = { lat: 0, lng: 0 };
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: uluru,
    });
    
}

export function addPin(coords){
    // Initialize and add the map
    const uluru = { lat: coords.lat, lng: coords.long };
    const marker = new google.maps.Marker({
      position: uluru,
      map: map,
    });
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
  }
  
  
  window.initMap = initMap;