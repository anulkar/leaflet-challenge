// Query URL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryURL, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data);
    createFeatures(data.features)
  });

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3>" + 
            "<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
    
    // This will be run when L.geoJSON creates the point layer from the GeoJSON data.
    function createCircleMarker(feature, latlng) {

        var magnitude = feature.properties.mag;

        // Change the values of these options to change the symbol's appearance
        let markerOptions = {
            stroke: true,
            fillOpacity: 0.5,
            color: "black",
            fillColor: getColor(magnitude),
            weight: 0.3,
            radius: magnitude * 5
        }
    return L.circleMarker(latlng, markerOptions);
    }

    function getColor(magnitude) {
        switch (true) {
            case (magnitude <= 1): 
                return '#00FF00';
            case (magnitude <= 2):
                return '#65FF00';
            case (magnitude <= 3):
                return '#CBFF00';
            case (magnitude <= 4):
                return '#FFCC00';
            case (magnitude <= 5):
                return '#FF6600';
            default:
                return '#FF0000';
          }
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: createCircleMarker
    });
    
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
        40.866667, 34.566667
        ],
        zoom: 2,
        layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create a legend to display information about our map
    var info = L.control({
        position: "bottomright"
    });

    // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        return div;
    };
    // Add the info legend to the map
    info.addTo(map);
}