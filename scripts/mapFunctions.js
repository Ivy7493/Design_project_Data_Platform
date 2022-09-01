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

  export function addRoute(coords){
    
    //dirRenderer=[]
    if(coords.length < 2){
        return
    }
    let dirService = new google.maps.DirectionsService();
    
    

    let dirRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});

    

    if (dirRenderer != null) {
      
      dirRenderer.setMap(null);
      dirRenderer = null;
      dirRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
    }

    dirRenderer.setMap(map);
    let temp = [] 
    coords.map(x=>{
          let y = {location: x}
          temp.push(y)
    })
    temp = temp.slice(0,24)
    // highlight a street
    let request = {
        origin: coords[0],
        destination: coords[coords.length -1 ],
        waypoints: temp,
        travelMode: google.maps.TravelMode.DRIVING
    };
    dirService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          
            dirRenderer.setDirections(result);
        }
    });
    
  }
  
  
  window.initMap = initMap;