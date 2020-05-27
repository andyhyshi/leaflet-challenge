//stores api inside queryURL
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createMap function
    createMap(data.features);
  });

// Function to color the circles based on the magnitude
   function circleColor(mag) {
    if (mag > 5) {
      return '#E50003'
    } else if (mag > 4) {
      return '#D2291D'
    } else if (mag > 3) {
      return '#BF5237'
    } else if (mag > 2) {
        return '#AD7C52'
    } else if (mag > 1) {
        return '#9AA56C'
    } else {
      return '#88CF87'
    }
  };


  function createMap(earthquakeData) {
    
    // Using L.geoJSON to do circles
    var EarthquakeMarkers = earthquakeData.map((feature) =>
        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            color: circleColor(feature.properties.mag),
            fillColor: circleColor(feature.properties.mag),
            fillOpacity: 1,
            radius: feature.properties.mag * 12000
          })
    
          // Function to add Popups to each circle
          .bindPopup("<h2> Magnitude: " + feature.properties.mag +
          "</h2><hr><h3> Location: " + feature.properties.place +
            "</h3><hr><p> Date: " + new Date(feature.properties.time) + "</p>")
      )

      // Add the earthquakes layer to a marker cluster group.
      var earthquakes=L.layerGroup(EarthquakeMarkers)
  
  
// Creating main map
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
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
    "Light Map": streetmap,
    "Dark Map": darkmap
  };

// Create overlay object to hold our overlay layer
var overlayMaps = {
    EarthquakeMarkers: earthquakes
  };

 
// Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      38.09, -114.71
    ],
    zoom: 6,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // Set up the legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {

      var div = L.DomUtil.create('div', 'info legend'),
          m = [0, 1, 2, 3, 4, 5],
          labels = [],
          from, to;

      for (var i = 0; i < m.length; i++) {
          from = m[i];
          to = m[i + 1];

          labels.push(
          '<i style="background:' + circleColor(from + 1) + '"></i> ' +
          from + (to ? '&ndash;' + to : '+'));
                   
      }

        div.innerHTML = labels.join('<br>');
      return div;
  }; 

  legend.addTo(myMap);

};