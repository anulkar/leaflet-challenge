# Visualizing Global Earthquakes Data with Leaflet

The USGS is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. USGS provides earthquake data in a number of different formats, updated every 5 minutes.

## Datasets Used
1. [USGS GeoJSON summary data](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson) for all earthquakes for the past 7 days.
2. [GeoJSON data](https://github.com/anulkar/leaflet-challenge/blob/master/static/data/PB2002_plates.json) on Tectonic Plates sourced from https://github.com/fraxen/tectonicplates.

## Visualizations
1. Created [a basic visualization map](https://github.com/anulkar/leaflet-challenge/blob/master/index.html) using HTML, CSS,    D3.js, Leaflet.js, and Mapbox API that plots all earthquakes from the dataset based on their longitude and latitude.
   * Circle data markers on the map reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes appear larger and darker in color.
   * Popups provide additional information about the earthquake when a marker is clicked.
   * Added a legend to the map that provides context for the map data.
2. Plotted the tectonic plates data set to illustrate the relationship between tectonic plates and seismic activity.
   * Added a number of base maps to choose from, as well as separated out the two different data sets into overlays that can be turned on and off independently.
   * Added layer controls to the map.
