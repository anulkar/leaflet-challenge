# Visualizing Global Earthquakes Data with Leaflet

The USGS is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. USGS provides earthquake data in a number of different formats, updated every 5 minutes.

* Retrieved [USGS GeoJSON summary data](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson) for all earthquakes for the past 7 days.
* Created [a basic visualization map](https://github.com/anulkar/leaflet-challenge/blob/master/index.html) using HTML, CSS, D3.js, Leaflet.js, and Mapbox API that plots all earthquakes from the dataset based on their longitude and latitude.
  * Circle data markers on the map reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes appear larger and darker in color.
  * Popups provide additional information about the earthquake when a marker is clicked.
  * Added a legend to the map that provides context for the map data.
