// Define all the base map layers: Streets, Dark, Outdoors and Satellite
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

    var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});

    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Outdoors Map": outdoorsmap,
    "Satellite Map": satellitemap,
};

// Create our map, giving it the streetmap view by default; we will add overlays later
var myMap = L.map("map", {
    center: [
    40.866667, 34.566667
    ],
    zoom: 2,
    layers: [streetmap]
});

// Create a layer control and add base maps to the map
var layerControl = L.control.layers(baseMaps).addTo(myMap);
layerControl.expand();

// Query URL to retrieve GeoJSON summary data for all earthquakes from USGS for the past 7 days
// Reference: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
var queryEarthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Query URL for the local GeoJSON file containing tetonic plates data
var queryTetonicPlates = "static/data/PB2002_plates.json";

// Perform a GET request to the query URL
d3.json(queryEarthquakeData, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createEarthquakeFeatures(data.features)
  });

// Call function to add a color coded Legend for earthquake data 
addLegend();

// Read the Tetonic Plates GeoJSON file
d3.json(queryTetonicPlates, function(data) {
    createTetonicPlatesFeatures(data.features);
});

// Function to loop through the features of the Earthquake dataset and plot the data on the map
function createEarthquakeFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3>" + 
            "<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
    
    // This will be run when L.geoJSON creates the point layer from the GeoJSON data.
    function createCircleMarker(feature, latlng) {

        var magnitude = feature.properties.mag;

        // Change the marker options based on the earthquake's magnitude
        // Earthquakes with higher magnitudes appear larger in size and darker in color
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

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    // Run the createCircleMarker function
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: createCircleMarker
    });

    // Pass in the overlayMap to the layer control
    // Add the layer control to the map
    layerControl.addOverlay(earthquakes, "Earthquakes").addTo(myMap);
    layerControl.expand();
}

// Function to loop through the features of the Tetonic Plates dataset and plot the data on the map
function createTetonicPlatesFeatures(tetonicPlatesData) {
    
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the tetonic plate name
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>Plate Name: " + feature.properties.PlateName + "</h3>");
    }

    // Create a GeoJSON layer containing the features array on the tetonicPlatesData object
    // Run the onEachFeature function once for each piece of data in the array
    var tetonicPlates = L.geoJSON(tetonicPlatesData, {
        onEachFeature: onEachFeature
    });

    // Pass in the overlayMap to the layer control
    // Add the layer control to the map
    layerControl.addOverlay(tetonicPlates,"Fault Lines").addTo(myMap);
    layerControl.expand();
  }

// Function to get color based on the magnitude of the earthquake 
// Earthquakes with higher magnitudes appear darker in color
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

// Function to add a color coded Legend for earthquake data 
function addLegend() {
    // Custom Legend Control
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [],
			from, to;

        // Loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(myMap);
}