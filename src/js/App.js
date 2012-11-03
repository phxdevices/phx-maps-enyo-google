enyo.kind({
  name: "App",
  classes: "app",
  components: [
      {kind: "FittableRows", classes: "enyo-fit", components: [
        {kind: "onyx.Toolbar", classes: "toolbar", components: [
          {name: "menu", classes: "menu", defaultKind: "onyx.IconButton", components: [
            {src: "images/menu-icon-info.png", panel: "info", ontap: "togglePullout"},
            {src: "images/menu-icon-mylocation.png", ontap: "findCurrentLocation"}
          ]},
          {kind: "Group", defaultKind: "onyx.IconButton", tag: null, components: [
            {name: "searchButton", src: "images/topbar-search-icon.png", active: true, ontap: "toggleSearchDirections"},
            {name: "directionButton", src: "images/topbar-direct-icon.png", ontap: "toggleSearchDirections"}
          ]},
          {name: "searchBox", kind: "onyx.InputDecorator", components: [
            {name: "searchLocation", classes: "search-input", kind: "onyx.Input", placeholder: "Search (e.g. New York City)", onchange: "codeAddress"},
            {kind: "Image", src: "images/search-input-search.png", ontap: "codeAddress"}
          ]},
          {name: "directionBoxA", showing: false, kind: "onyx.InputDecorator", components: [ 
            {kind: "Image", classes: "direction-img", src: "images/direction-a.png"},
            {name: "directionStart", classes: "search-input", kind: "onyx.Input", placeholder: "Starting Location"},
          ]},
          {name: "directionBoxB", showing: false, kind: "onyx.InputDecorator", components: [ 
            {kind: "Image", classes: "direction-img", src: "images/direction-b.png"},
            {name: "directionEnd", classes: "search-input", kind: "onyx.Input", placeholder: "Ending Location", onchange: "codeDirection"},
            {kind: "Image", src: "images/search-input-search.png", ontap: "codeDirection"}
          ]}
        ]},
        {id: "map_test", classes:"enyo-googlemap", fit: true, style: ""}
      ]},
      {kind: "Pullout", classes: "pullout", 
        onShowTransit: "showTransit", 
        onShowTraffic: "showTraffic", 
        onShowBicycling: "showBicycling",
        onShowWeather: "showWeather",
        onMapTypeSelect: "mapTypeSelect", 
        onBookmarkSelect: "bookmarkSelect", components: [
        {classes: "pullout-menu", defaultKind: "onyx.IconButton", components: [
          {src: "images/menu-icon-info.png", panel: "info", ontap: "togglePullout"},
          {src: "images/menu-icon-bookmark.png", panel: "bookmark", ontap: "togglePullout"},
          {src: "images/menu-icon-mylocation.png", ontap: "findCurrentLocation"}
        ]}
      ]},
      {kind: "CurrentLocation", onSuccess: "currentLocationSuccess"}
  ],
  create: function(){
    this.inherited(arguments);
    this.init();
  },
  init: function(){
    google.maps.event.addDomListener(window, 'load', initialize);
    this.findCurrentLocation();
  },
  mapTypeSelect: function(inSender, inEvent) {
    switch (inEvent.mapType) {
      case "ROADMAP":
        var mapOptions = {
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        break;
      case "SATELLITE":
        var mapOptions = {
          mapTypeId: google.maps.MapTypeId.SATELLITE
        };
        break;
      case "HYBRID":
        var mapOptions = {
          mapTypeId: google.maps.MapTypeId.HYBRID
        };
        break;
      case "TERRAIN":
        var mapOptions = {
          mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        break;
      default:
        alert("Sie bleiben leider dumm");
        break;
    }
    
    map.setOptions(mapOptions);
  },
  resizeHandler: function() {
    console.log("window size changed");
  },
  togglePullout: function(inSender) {
    this.$.pullout.toggle(inSender.panel);
  },
  toggleSearchDirections: function() {
    this.$.searchBox.setShowing(this.$.searchButton.active);
    this.$.directionBoxA.setShowing(this.$.directionButton.active);
    this.$.directionBoxB.setShowing(this.$.directionButton.active);
  },
  testing:function(){
    console.log("testing intern clicked");
  },
  showTraffic: function(inSender, inEvent) {
    trafficLayer.setMap(inEvent.value ? map : null);
  },
  showTransit: function(inSender, inEvent) {
    transitLayer.setMap(inEvent.value ? map : null);
  },
  showBicycling: function (inSender, inEvent){
    bikeLayer.setMap(inEvent.value ? map : null);
  },
  showWeather: function(inSender, inEvent){
    weatherLayer.setMap(inEvent.value ? map : null);
    cloudLayer.setMap(inEvent.value ? map : null);
  },
  findCurrentLocation: function() {
    this.$.currentLocation.go();
  },
  currentLocationSuccess: function(inSender, inData) {
    currentPos = new google.maps.LatLng(inData.coords.latitude,
                                             inData.coords.longitude);
    map.setCenter(currentPos);
    map.setZoom(16);

    myLocationMarker.setPosition(currentPos);
    //myLocationMarker.setAnimation(google.maps.Animation.BOUNCE);

    inSender.stopTracking();
  },
  codeDirection: function(inSender, inEvent){
    directionsDisplay.setMap(map);
    startAddress = this.$.directionStart.getValue();
    endAddress = this.$.directionEnd.getValue();
    
    geocoder.geocode( { 'address': endAddress}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var selectedMode = "DRIVING";
        if(this.startAddress== ''){
          console.log("No StartAdress");
          var startPos = this.currentPos;
        }else{
          var startPos = this.startAddress;
        }
        
        var endPos = results[0].geometry.location;
        var request = {
            origin: startPos,
            destination: endPos,
            travelMode: google.maps.TravelMode[selectedMode]
        };
        console.log(selectedMode);
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        }.bind(this));
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  },
  codeAddress: function(inSender, inEvent) {
    var address = this.$.searchLocation.getValue();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        this.$.pullout.openPullout("searchpullout");
        this.$.pullout.setSearchData(results);
        map.setCenter(results[0].geometry.location);
        map.setZoom(15);
        var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    }.bind(this));
  }
});

function testing(){
  console.log("testing extern clicked");
}

function initialize() {
  currentPos = new google.maps.LatLng(-33, 151);

  var mapOptions = {
    zoom: 8,
    center: currentPos,
    disableDefaultUI: true,
    streetViewControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  
  map = new google.maps.Map(document.getElementById('map_test'),mapOptions);
  myLocationMarker = new google.maps.Marker({
        position: currentPos,
        map: map,
        icon: 'images/marker-my-location.png'
  });
}