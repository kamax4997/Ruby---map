// Author: Daniel Gonzalez
// Email: daniel.gonzalez@here.com, 
// Website: http://www.datastorytellinggroup.org


// Global credentials
var myAppId = "UythJfir49K0ZHzunhFA";
var myAppCode = "z9BEl98pKbJ96IKpeF30BQ";
var credentials = { app_id: myAppId, app_code: myAppCode };

// Map
var map;
var mapCenter = new H.geo.Point( 52.304968333386, 11.48184839843745 );
var mapZoom = 7;
var divided;
var from = {lat: 52.51607, lng: 13.37698};
var to = {lat: 47.39161, lng: 10.62774};

// Truck group
var truckGroup = new H.map.Group();
var truckRouteDashedGroup = new H.map.Group();
var truckRouteGroup = new H.map.Group();
var truckWeatherGroup = new H.map.Group();
var truckSlopeGroup = new H.map.Group();
var truckTrafficGroup = new H.map.Group();
var truckCurvesGroup = new H.map.Group();
var truckRestrictionGroup = new H.map.Group();

// Car group
var carGroup = new H.map.Group();
var carRouteDashedGroup = new H.map.Group();
var carRouteGroup = new H.map.Group();
var carWeatherGroup = new H.map.Group();
var carSlopeGroup = new H.map.Group();
var carTrafficGroup = new H.map.Group();
var carCurvesGroup = new H.map.Group();

var markersGroup = new H.map.Group();

// Restrictions
var truck_restrictions_layer;
var provider = new H.datalens.Provider();

var weather_conditions_layer;
var weather_provider = new H.datalens.Provider();

var carRouteResponse = null;
var truckRouteResponse = null;


// *** Markers ***
var orig_svg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 48" style="enable-background:new 0 0 48 48;" xml:space="preserve"><style type="text/css">	.st0{fill:#48DAD0;}	.st1{fill:none;}</style><g>	<path class="st0" d="M24,2C13.9,2,5.7,10.2,5.7,20.2c0,5,2.1,9.6,5.4,12.9L24,46l13-12.9c3.3-3.3,5.4-7.9,5.4-12.9		C42.3,10.2,34.1,2,24,2z M24,25c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S26.8,25,24,25z"/>	<rect y="0" class="st1" width="48" height="48"/></g></svg>';
var dest_svg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 48" style="enable-background:new 0 0 48 48;" xml:space="preserve"><style type="text/css">	.st0{fill:#D1F6F3;}	.st1{fill:#48DAD0;}	.st2{fill:none;}</style><path class="st0" d="M24,2.1c-10.3,0-18.7,8.4-18.7,18.6c0,5,1.9,9.7,5.5,13.2L24,47.1l13.3-13.2c3.6-3.5,5.5-8.2,5.5-13.2	C42.7,10.5,34.3,2.1,24,2.1z"/><g>	<path class="st1" d="M30,11v3.8h-6V9.3H24C26.2,9.3,28.3,9.9,30,11z"/>	<path class="st1" d="M35.1,20.3c0,0.2,0,0.4,0,0.6H30v-6h3.7C34.6,16.4,35.1,18.3,35.1,20.3z"/>	<path class="st1" d="M18,11.1v3.7h-3.5C15.3,13.4,16.5,12.1,18,11.1z"/>	<rect x="17.9" y="14.9" class="st1" width="6" height="6"/>	<rect x="24" y="20.9" class="st1" width="6" height="6"/>	<path class="st1" d="M30,29.5v-2.6h2.8C32.1,27.9,31.1,28.8,30,29.5z"/>	<path class="st1" d="M17.9,20.9v6h-2.7c-1.3-1.7-2.1-3.8-2.3-6H17.9z"/>	<path class="st1" d="M24,26.9v4.3c-2.2,0-4.3-0.7-6-1.8c0,0,0,0,0,0v-2.5L24,26.9L24,26.9z"/>	<path class="st1" d="M24,1.6c-10.6,0-19.2,8.5-19.2,19.1c0,5.1,2,9.9,5.6,13.5L24,47.6l13.5-13.5c3.6-3.6,5.6-8.4,5.6-13.5		C43.2,10.1,34.6,1.6,24,1.6z M24,46.2l-6.9-6.8h13.7L24,46.2z M34.8,27.4c-1.1,1.6-2.6,3-4.3,4c-1.9,1.1-4.2,1.7-6.4,1.7		c-2.4,0-4.6-0.6-6.6-1.8c-1.6-1-3.1-2.3-4.1-3.8c-1.3-1.9-2.1-4.2-2.2-6.5c0-0.2,0-0.5,0-0.7c0-2,0.5-4,1.4-5.8		c1.1-2.2,2.8-4,5-5.2c2-1.2,4.2-1.8,6.6-1.8c1.2,0,2.4,0.2,3.5,0.5c1.1,0.3,2,0.7,2.9,1.2c2.2,1.2,4,3.1,5.1,5.3 c0.8,1.5,1.3,3.2,1.4,4.9c0,0.3,0,0.6,0,0.9C37,22.8,36.2,25.3,34.8,27.4z"/>	<rect y="0" class="st2" width="48" height="48"/></g></svg>';
var restriction_svg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve"><g><path fill="#FF3154" d="M3.046,26.575c-1.1,0-1.55-0.779-1-1.732L14,4.14c0.55-0.953,1.45-0.953,2,0l11.953,20.703c0.55,0.953,0.1,1.732-1,1.732H3.046z"/></g><g id="Exclamation"><path fill="#FFFFFF" d="M15.003,20.197c-0.756,0-1.365,0.596-1.365,1.32c0,0.732,0.613,1.326,1.365,1.326s1.361-0.594,1.361-1.326C16.364,20.793,15.755,20.197,15.003,20.197z M15.003,18.865c0.566,0,1.057-0.447,1.088-0.992l0.363-5.916c0.035-0.547-0.615-0.996-1.453-0.996c-0.832,0-1.49,0.449-1.455,0.996l0.363,5.916C13.94,18.418,14.435,18.865,15.003,18.865z"/></g></svg>';

// *** Route styles ***
var color_route           = "rgba(0,137,173,0.7)";
var route_thickness       = 5;

var color_dash_route      = "rgba(147,157,170,1)";
var color_dash_route_hover= "rgba(157,167,180,1)";

var color_weather         = "rgba(255,130,66,1)";
var color_weather_hover   = "rgba(255,168,125,1)";
var weather_thickness     = 10;

var color_slopes          = "rgba(18,65,145,1)";
var color_slopes_hover    = "rgba(24,88,196,1)";
var slopes_thickness      = 5;
var slope_degree_threshold = 6;

var color_curves          = "rgba(62,200,119,1)";
var color_curves_hover    = "rgba(117,255,145,1)";
var curves_thickness      = 5.5;

var color_traffic         = "rgba(255,49,84,1)";
var color_traffic_hover   = "rgba(255,79,109,1)";
var traffic_thickness     = 2;


// *** Chart ***
var svg;

// *** Glogal ****
var dataReady = 0;
var t_divided;
var c_divided;
var routeOnFocus = null;
var isTruck = true;
var bounds;
var truck_raw_route;
var car_raw_route;


// **** TIMES VARIABLES ****
var slope_shifted_time = 0;
var curve_shifted_time = 0;
var traffic_shifted_time = 0;
var weather_shifted_time = 0;
var time_per_slope = 5;
var time_per_curve = 2;
var time_per_weather = 10;

var truck_total_eta_time = 0;
var car_total_eta_time = 0;



function initMap () {

  // Init map
  map = MapUtilities.addMap("basemap", {  tileType:"basetile", 
                                          ppi:320,
                                          scheme:"reduced.night", 
                                          center:mapCenter, 
                                          zoom: mapZoom,
                                          fixedCenter:false,
                                          reducedLabels:true,
                                          padding: { left:200, top:0, right:150, bottom: 0 }
                                        });

  map.addEventListener('mapviewchange', function() {
    $('.info-bubble').css({opacity:0});
  });

  // Car group
  map.addObject(carGroup)
  carGroup.addObject(carWeatherGroup)
  carGroup.addObject(carRouteDashedGroup)
  carGroup.addObject(carRouteGroup)
  carGroup.addObject(carSlopeGroup)
  carGroup.addObject(carTrafficGroup)
  carGroup.addObject(carCurvesGroup)

  carRouteDashedGroup.setVisibility(true);
  carRouteGroup.setVisibility(false);
  carWeatherGroup.setVisibility(false);
  carCurvesGroup.setVisibility(false);
  carSlopeGroup.setVisibility(false);
  carTrafficGroup.setVisibility(false);

  // Truck group
  map.addObject(truckGroup)
  truckGroup.addObject(truckWeatherGroup)
  truckGroup.addObject(truckRouteDashedGroup)
  truckGroup.addObject(truckRouteGroup)
  truckGroup.addObject(truckCurvesGroup)
  truckGroup.addObject(truckSlopeGroup)
  truckGroup.addObject(truckTrafficGroup)
  truckGroup.addObject(truckRestrictionGroup);

  truckRouteDashedGroup.setVisibility(false);

  // Origin / Dest markers group
  map.addObject(markersGroup)

}





$(document).ready(function() {

  // *** Init Degaframework ***
  AppCore.setup(credentials);
  MapUtilities.setup();
  Routing.setup();
  Weather.setup();
  Traffic.setup();
  Geocoder.setup();

  // *** Init UI Interactions
  initLegendInteractions();  
  initRouteSettingsUI();
  initChartSettings();

  // Read Cookies
  var c_orig = getCookie("origin");
  var c_dest = getCookie("destination");
  if (c_orig != null ) fromString = $('#routing-origin').val( c_orig );
  if (c_dest != null ) toString = $('#routing-dest').val( c_dest );

  initMap ();

  svg = d3.select("svg")

  window.addEventListener("resize", function( evt ) { 
    initLineChart(routeOnFocus)
  });

});



function drawRoutes ( from, to ) {

  dataReady = 0;

  // **** Truck route ****
  Routing.setVehicleType('truck');
  Routing.setEngineType("gasoline");
  Routing.setEnergyConsumption(6);
  Routing.setTrailerCount(1);

  Routing.calculate( from, to, function (result) {

    if (result.type == "ApplicationError") {
      $('.warning').show();
      $('.loading').hide();
      $('.stats').hide();
      return;
    } 

    // console.log(result)
    truck_raw_route = result;
    // console.log(truck_raw_route)

    $('.stats').show();

    $('.dist').text(Routing.getTotalDistanceinKm(result) + " Km")
    $('.co2').text(Routing.getTotalCO2Emissions(result) + " Kg")

    var route = Routing.getRoute(result);
    var bbox = Routing.getBoundingBox(result);

    bounds = new H.geo.Rect( bbox.topLeft.latitude, bbox.topLeft.longitude, bbox.bottomRight.latitude, bbox.bottomRight.longitude );
    MapUtilities.setMapViewToBounds(bounds,1.5)

    t_divided = Routing.divide(route,5);
    routeOnFocus = t_divided;
    // console.log(t_divided)

    drawDashedRoute (t_divided, truckRouteDashedGroup )
    drawRoute (t_divided, truckRouteGroup);
    drawSlopes (t_divided, truckSlopeGroup);
    drawCurves (t_divided, truckCurvesGroup);
    drawWeather (t_divided, truckWeatherGroup);
    drawTraffic (t_divided, truckTrafficGroup);
    drawRestrictions (t_divided);
    
  })



  // **** Car Route ****
  Routing.setVehicleType('car');
  Routing.setEngineType("gasoline");
  Routing.setEnergyConsumption(6.5);
  Routing.setTrailerCount(0);

  Routing.calculate( from, to, function (result) {
    
    if (result.type == "ApplicationError") {
      $('.warning').show();
      $('.loading').hide();
      return;
    } 

    car_raw_route = result;

    // console.log("CAR Total distance", Routing.getTotalDistanceinKm(result))
    // console.log("CAR Total Co2 Emissions", Routing.getTotalCO2Emissions(result))

    var route = Routing.getRoute(result);
    c_divided = Routing.divide(route,5);

    drawDashedRoute ( c_divided, carRouteDashedGroup )
    drawRoute ( c_divided, carRouteGroup );
    drawSlopes ( c_divided, carSlopeGroup );
    drawCurves ( c_divided, carCurvesGroup);
    drawWeather ( c_divided, carWeatherGroup);
    drawTraffic ( c_divided, carTrafficGroup);

  });

  // **** Add origin & destination marker ****
  markersGroup.addObject( Drawing.drawMarker ({svg: orig_svg, coords:from, size:{ width:60, height:60 }, anchor : { x:60/2, y: 60 + 8 }}));
  markersGroup.addObject(Drawing.drawMarker ({svg: dest_svg, coords:to, size:{ width:60, height:60 }, anchor : { x:60/2, y: 60 + 8 }}));

}


// ***** Drawing Methods ******
// *********************************************

function drawRestrictions ( divided ) {

  // Restriction data
  var all_restrictions = []

  for (var x = 0; x < divided.length; x++) {
    var rest = divided[x].restrictions;
    for (var i = 0; i < rest.length; i++) {
      var coords = rest[i].position.split(",");
      var keyNames = Object.keys( rest[i].restriction );
      all_restrictions.push({lat:+coords[0],lng:+coords[1],msg:keyNames[0].camelToSentence() })
    };
  }

  //map layer with clusters
  provider.setData(all_restrictions)

  truck_restrictions_layer = new H.datalens.ObjectLayer( provider, {

    pixelRatio: window.devicePixelRatio,

    dataToRows: function ( data ) {
      return data;
    },

    rowToMapObject: function(cluster) {
      var marker = new H.map.Marker(cluster.getPosition());
      marker.addEventListener( "tap", function ( evt ){
        var message = ""; 
		
		if(evt.target.getData().isCluster())
		{
			var data = evt.target.getData();
			data.forEachDataPoint(function (p) 
			{
				var pmsg = p.getData().msg;
				if(message.indexOf(pmsg) == -1)
					message += p.getData().msg + "\r\n";
			});
		}
		else
		{
			message = evt.target.getData().msg;
		}
		
        updateInfoBubble("Truck Restriction", message, 0, "traffic-type", null, evt.currentPointer.viewportX, evt.currentPointer.viewportY );
      })
      return marker;
    },

    rowToStyle: function(cluster) {
      return {
        icon: new H.map.Icon( restriction_svg, { size: new H.math.Size( 30 * AppCore.ppi, 30 * AppCore.ppi) }) 
      };
    },
    clustering: {
      rowToDataPoint: function({lat, lng, count}) {
        return new H.clustering.DataPoint(
          lat, lng, count
        );
      },
      options: function() {
        return {
          eps: 100,
          strategy: H.clustering.Provider.Strategy.GRID
        };
      }
    }
  });

  map.addLayer(truck_restrictions_layer);
}

function drawDashedRoute ( divided, group ) {

  for (var i = 0 ; i < divided.length; i++) {
    
    var tmp_styles = {
      normal:{
        strokeColor: color_dash_route,
        lineWidth: 2,
        lineCap: 'round',
        lineJoin: 'bevel',
        lineDash:[4,4]
      }, 
      hover: {
        strokeColor: color_dash_route_hover,
        lineWidth: 3,
        lineCap: 'round',
        lineJoin: 'bevel',
        lineDash:[4,4]
      }
    };

    var s = divided[i].shape;
    var strip = new H.geo.Strip();

    for (var x = 0; x < s.length; x++) {
      var tmp_parts = s[x].split(',');
      strip.pushLatLngAlt( +tmp_parts[0], +tmp_parts[1], +tmp_parts[2] );
    };

    var polyline = Drawing.drawPolyline( strip, tmp_styles );  
    group.addObject(polyline)
    divided[i].bounds = polyline.getBounds();

  };
}

function drawRoute ( divided, group ) {

  for (var i = 0 ; i < divided.length; i++) {
    
    var tmp_styles = {
      normal: {
        strokeColor: color_route,
        lineWidth: route_thickness,
        lineCap: 'round',
        lineJoin: 'bevel'
      },
      hover:{
        strokeColor: color_route,
        lineWidth: route_thickness,
        lineCap: 'round',
        lineJoin: 'bevel'
      }
    };

    var s = divided[i].shape;
    var strip = new H.geo.Strip();

    for (var x = 0; x < s.length; x++) {
      var tmp_parts = s[x].split(',');
      strip.pushLatLngAlt( +tmp_parts[0], +tmp_parts[1], +tmp_parts[2] );
    };

    var polyline = Drawing.drawPolyline( strip, tmp_styles );  
    group.addObject(polyline)
    divided[i].bounds = polyline.getBounds();

  };
}

function drawSlopes ( divided, group ) {

  slope_shifted_time = 0;

  var tmp_styles = {
    normal:{
      strokeColor: color_slopes,
      lineWidth: slopes_thickness,
      lineCap: 'round',
      lineJoin: 'bevel'
    }, 
    hover: {
      strokeColor: color_slopes,
      lineWidth: slopes_thickness + 3,
      lineCap: 'round',
      lineJoin: 'bevel'
    }
  };
 
  for (var i = 0; i < divided.length; i++) {
    
    var shape = divided[i].shape;

    for (var x = 1; x < shape.length - 2; x++) {
      
      var prev_coord = shape[x-1].split(',');
      var coord = shape[x].split(',');
      var next_coord = shape[x+1].split(',');
      
      var meters = MathUtilities.distanceBetweenCoordinates({lat:+coord[0],lng:+coord[1]}, {lat:+next_coord[0],lng:+next_coord[1]}) * 1000;
      var angle = MathUtilities.angleBetweenPoints({x:0,y:+coord[2]}, {x:meters,y:+next_coord[2]});
      angle = MathUtilities.degrees(angle);
      
      if ( Math.abs( angle ) > slope_degree_threshold ){

        slope_shifted_time += time_per_slope;
        
        var strip = new H.geo.Strip();
        strip.pushLatLngAlt( prev_coord[0], prev_coord[1], prev_coord[2] );
        strip.pushLatLngAlt( coord[0], coord[1], coord[2] );
        strip.pushLatLngAlt( next_coord[0], next_coord[1], next_coord[2] );

        var polyline = Drawing.drawPolyline( strip, tmp_styles );
        polyline.angle = angle;
        
        polyline.addEventListener('tap', function (evt) {
          updateInfoBubble("Dangerous slope", "Inclination of " + evt.target.angle.toFixed(1) + " degrees", time_per_slope, "slope-type", null, evt.currentPointer.viewportX, evt.currentPointer.viewportY );
        });
        group.addObject( polyline );
        divided[i].slopes ++;
      }

      divided[i].preciseDate = new Date( moment(divided[i].preciseDate).add( slope_shifted_time, "seconds").toString() )

    };

  };

}

function drawCurves (divided, group ) {

  // console.log("reset curves")
  curve_shifted_time = 0;

  var tmp_styles = {
    normal:{
      strokeColor: color_curves,
      lineWidth: curves_thickness,
      lineCap: 'round',
      lineJoin: 'bevel'
    }, 
    hover: {
      strokeColor: color_curves_hover,
      lineWidth: curves_thickness + 3,
      lineCap: 'round',
      lineJoin: 'bevel'
    }
  };

  for (var i = 0; i < divided.length; i++) {
    
    var shape = divided[i].shape;

    for (var x = 1; x < shape.length - 2; x+=1 ) {
      
      var zero = shape[x-1].split(',');
      var first = shape[x].split(',');
      var second = shape[x+1].split(',');

      var angle = MathUtilities.angleBetweenCoords({lat:zero[0],lng:zero[1]}, {lat:first[0],lng:first[1]});
      var prev_angle = MathUtilities.angleBetweenCoords({lat:first[0],lng:first[1]}, {lat:second[0],lng:second[1]});
      var diff = MathUtilities.degrees(angle - prev_angle);
      var distance = MathUtilities.distanceBetweenCoordinates({lat:zero[0],lng:zero[1]}, {lat:second[0],lng:second[1]});
      
      var diff = diff;

      if ( Math.abs( diff ) > 8  && distance < 0.06 ){

        var strip = new H.geo.Strip();
        strip.pushLatLngAlt( zero[0], zero[1], zero[2] );
        strip.pushLatLngAlt( first[0], first[1], first[2] );
        strip.pushLatLngAlt( second[0], second[1], second[2] );

        var polyline = Drawing.drawPolyline( strip, tmp_styles );
      
        polyline.addEventListener('tap', function (evt) {
          updateInfoBubble("Dangerous curve", "Strong curve ahead", time_per_curve, "curve-type", null, evt.currentPointer.viewportX, evt.currentPointer.viewportY );
        });
        group.addObject( polyline );
        divided[i].curves ++;
 
      }
    }

    curve_shifted_time += divided[i].curves * time_per_curve;
    divided[i].preciseDate = new Date( moment(divided[i].preciseDate).add( curve_shifted_time, "seconds").toString() )

  }
}

function drawTraffic ( divided, group ) {
    
    for (var j = 0; j < divided.length; j++) {

      getTraffic( divided[j], j ).done( function ( data, route, index ){
        
        if (index == 0) {
          // console.log("reset count");
          traffic_shifted_time = 0;
        } 

        var accumulativeJam = 0;

        if ( data.RWS.length > 0 ) {
          if (data.RWS[0].RW.length > 0) {
            var roadSegments = data.RWS[0].RW;
            
            for (var c = 0; c < roadSegments.length; c++) {
              if (roadSegments[c].FIS.length > 0) {
                if (roadSegments[c].FIS[0].FI[0].SHP.length > 0 ){
                  var jamFactor = roadSegments[c].FIS[0].FI[0].CF[0].JF;
                  accumulativeJam += jamFactor;
                }
              }
            };
            accumulativeJam = (accumulativeJam / roadSegments.length).toFixed(1);
          }
        }

        route.traffic = parseFloat(accumulativeJam);
        traffic_shifted_time += (5 * (accumulativeJam * 0.05)) * 60;

        // Lets consider tha a avg jam factor of 5 will affect the ETA
        if (route.traffic > 5) {

          var tmpstyles = {
            normal: {
              strokeColor: color_traffic,
              lineWidth: traffic_thickness,
              lineCap: 'round',
              lineJoin: 'bevel'
            },
            hover: {
              strokeColor: color_traffic,
              lineWidth: traffic_thickness + 2,
              lineCap: 'round',
              lineJoin: 'bevel'
            }
          };

          shapes = route.shape;
          var strips = new H.geo.Strip();

          for (var x = 0; x < route.shape.length; x++) {
            var coords_string = route.shape[x];
            var parts = coords_string.split(',');
            strips.pushLatLngAlt( parts[0], parts[1], 0 );
          };

          var polyline = Drawing.drawPolyline( strips, tmpstyles )
          polyline.trafficJamFactor = accumulativeJam;

          polyline.addEventListener('tap', function (evt) {
            updateInfoBubble( "Traffic congestion", "Traffic jam factor of " + evt.target.trafficJamFactor, (5 * (accumulativeJam / 10)) * 60, "traffic-type", null, evt.currentPointer.viewportX, evt.currentPointer.viewportY )
          });

          group.addObject(polyline)

          // divided[index].preciseDate = new Date( moment(divided[index].preciseDate).add( traffic_shifted_time, "seconds").toString() )

        };
                
        if ( index >= divided.length - 1 ) {
          dataReady ++;
          initLineChart( divided )
        }

      })
    };
} 

function drawWeather ( divided, group ) {

  for (var i = 0; i < divided.length; i++) {

    // Retrieve to API the weather condition Of all LatLng of the route
    Weather.getWeatherConditionFromLocation( divided[i].position, i ).done( function ( result, index ) {

      if ( index == 0 ) weather_shifted_time = 0;

      // Store this information on each route section
      var tmp_weather = result.observations.location[0].observation[0];

      var tmp_weather = {
        temperature: parseFloat( tmp_weather.temperature ),
        humidity: parseFloat( tmp_weather.humidity ),
        iconName: tmp_weather.iconName,
        iconLink: tmp_weather.iconLink,
        windSpeed: tmp_weather.windSpeed,
        windDirection: tmp_weather.windDirection,
      }

      divided[index].weather = tmp_weather;
      
      // This is the last one: When all the calls to the API are done, then paint
      if (index == divided.length - 1){

        for (var j = 1; j < divided.length; j++) {
          
          // Only rendering the weather warnings
          var iconName = divided[j].weather.iconName;
          var warning = Weather.isItOnPrecipitationList(iconName);
          if (warning) {
            weather_shifted_time += time_per_weather;
            
            // Style logic
            // var colors = ["#0071bc","#ffffc8","#f15a24"];
            // var normalize = MathUtilities.mapValues( parseFloat(divided[j].weather.temperature), 0, 30, 0, 1 );
            // var altitude_normalize = MathUtilities.mapValues( parseFloat(divided[j].position.alt), 0, 2000, 0, 1 );
            // var strokeColor = warning? color_weather : MathUtilities.lerpColors( colors, normalize );

            // var lineWidth = (altitude_normalize * 8) + 2;

            var tmpstyles = {
              normal: {
                strokeColor: color_weather,
                lineWidth: weather_thickness,
                lineCap: 'round',
                lineJoin: 'bevel',
              },
              hover: {
                strokeColor: color_weather,
                lineWidth: weather_thickness + 3,
                lineCap: 'round',
                lineJoin: 'bevel',
              }
            };

            // Parse LatLngs into Strip format
            var strips = new H.geo.Strip();
            for (var x = 0; x < divided[j].shape.length; x++) {
              var parts = divided[j].shape[x].split(',');
              strips.pushLatLngAlt( parts[0], parts[1], parts[2] );
            };

            var polyline = Drawing.drawPolyline( strips, tmpstyles )

            // I store the extra style information inside the polyline object
            polyline.iconName = iconName;
            polyline.metadata = { weatherInfo: divided[j].weather };

            // Add events
            polyline.addEventListener('tap', function (evt) {
              var weatherHumanReadableName = evt.target.iconName.split("_").join(" ").toProperCase();
              updateInfoBubble( "Poor Weather Conditions", weatherHumanReadableName, time_per_weather, "weather-type", '<img src="' + evt.target.metadata.weatherInfo.iconLink + '"/>', evt.currentPointer.viewportX, evt.currentPointer.viewportY )
            })

            group.addObject(polyline);
            
          }

          divided[j].preciseDate = new Date( moment(divided[j].preciseDate).add( weather_shifted_time, "seconds").toString() )
          
        }
        
        dataReady ++;
        initLineChart( divided )
        drawWeatherIcons( divided );
      }    
    });
  };

}

function drawWeatherIcons ( divided ) {

  // Restriction data
  var all_weather = []

  for (var x = 0; x < divided.length; x++) {
    // console.log()
    var icon = divided[x].weather.iconLink;
    var pos = divided[x].position;
    if ( Weather.isItOnPrecipitationList(divided[x].weather.iconName) )
      all_weather.push({ lat:pos.lat, lng:pos.lng, icon:icon })
  }

  //map layer with clusters
  weather_provider.setData(all_weather)

  weather_conditions_layer = new H.datalens.ObjectLayer( weather_provider, {

    pixelRatio: window.devicePixelRatio,

    dataToRows: function ( data ) {
      return data;
    },

    rowToMapObject: function(cluster) {
      
      var marker = new H.map.Marker(cluster.getPosition());

      return marker;
    },

    rowToStyle: function(cluster) {
      var size = 40 * AppCore.ppi;
      var anchor = { x:size + 20, y: ( size / 2 + 8) };
	  
	  var icons = new Object(),
		  icon = "";
	  
	  if(cluster.isCluster())
	  {
		  cluster.forEachDataPoint(
			function(p)
			{
				if(icons[p.getData().icon])
					icons[p.getData().icon]++;
				else
					icons[p.getData().icon] = 1;
			});
		  
		  var c = 0;
						  
		  $.each( icons, function(index,value)
		  {
			if(c < value)
			{
				icon = index;
				c = value;
			}
		  })
	  }
	  else
	  {
		  icon = cluster.getData().icon;
	  }
	  
      return {
		icon: new H.map.Icon( icon , { size: new H.math.Size( size, size ), anchor: anchor }) 
      };
    },
    clustering: {
      rowToDataPoint: function({lat, lng, count}) {
        return new H.clustering.DataPoint(
          lat, lng, count
        );
      },
      options: function() {
        return {
          eps: 150,
          strategy: H.clustering.Provider.Strategy.GRID
        };
      }
    }
  });

  map.addLayer(weather_conditions_layer);

}

function getTraffic( route, i ) {

  var deferred = $.Deferred();

   if ( route.shape.length > 0 ) {

    var corridor = route.shape.map((point) => {
      var lastCommaIndex = point.split('').lastIndexOf(',');
      return point.slice(0, lastCommaIndex);
    })

    corridor.push('1');
    var corridorString = corridor.join(';');

    $.ajax({
      url: 'https://traffic.api.here.com/traffic/6.1/flow.json',
      type: 'GET',
      dataType: 'jsonp',
      jsonp: 'jsoncallback',
      data: {
        app_id: myAppId, 
        app_code: myAppCode,
        // jsonAttributes:39,
        corridor: corridorString,
        minjamfactor: 5.0,
        responseattributes: 'sh'
        // responseattributes: 'sh,fc'
      },
      success: function ( data ) {
        deferred.resolve( data, route, i );
      },
      error: function ( err ) {
        throw(err);
      }
    });
  }
  return deferred.promise();
}


function beautifyTime ( duration ) {
  return (duration.hours() > 0 ? duration.hours() + "h " : "") + (duration.minutes() > 0 ? duration.minutes() + "m " : "") + (duration.seconds() > 0? duration.seconds() + "s" : "")
}

function initLineChart ( route ) {
  
  if (dataReady < 3) return;

  weather_conditions_layer.redraw();

  hideSpinner();

  var estimated_time = 0;
  for (var i = 0; i < route.length; i++) {
    estimated_time += route[i].travelTime;
  }

  
  var startDate = route[0].date;
  var endDateETA = route[route.length-1].date;
  var m = moment(endDateETA);
  
  var trafficDuration = moment.duration( traffic_shifted_time, 'seconds' );
  var weatherDuration = moment.duration( weather_shifted_time, 'seconds' );
  var curvesDuration = moment.duration( curve_shifted_time, 'seconds' );
  var slopesDuration = moment.duration( slope_shifted_time, 'seconds' );
  var alltogether = moment.duration( traffic_shifted_time + weather_shifted_time + curve_shifted_time + slope_shifted_time, 'seconds' );


  var etaInSeconds = Routing.getRoute( isTruck? truck_raw_route : car_raw_route ).summary.travelTime;
  var estimate_duration = moment.duration( etaInSeconds, 'seconds' )
  var precise_duration = moment.duration( etaInSeconds + traffic_shifted_time + weather_shifted_time + curve_shifted_time + slope_shifted_time, 'seconds' )

  var trafficEndDate = new Date( m.add( trafficDuration ).toString());
  var weatherEndDate = new Date( moment(trafficEndDate).add( weather_shifted_time, 'seconds' ).toString());
  var curvesEndDate = new Date( moment(weatherEndDate).add( curve_shifted_time, 'seconds' ).toString());
  var slopesEndDate = new Date( moment(curvesEndDate).add( slope_shifted_time, 'seconds' ).toString());

  var endPTADate = new Date(moment(endDateETA).add( traffic_shifted_time + weather_shifted_time + curve_shifted_time + slope_shifted_time, 'seconds' ).toString())

  $('.traffic-l').text( "+ " + beautifyTime(trafficDuration))
  $('.weather-l').text( "+ " + beautifyTime(weatherDuration))
  $('.slopes-l').text( "+ " + beautifyTime(slopesDuration))
  $('.curves-l').text( "+ " + beautifyTime(curvesDuration))
  
  svg.selectAll("*").remove()

  // Size
  var margin = { top: 50, bottom: 30, right: 0, left: 0 };
  var width = $('.elevation-chart').width();
  var height = 110;
  
  svg.attr("width", '100%').attr("height", height )
  
 
  // Set Axis scales
  x = d3.scaleTime().domain([startDate, endPTADate]).range([ 0, width ]);
  // y = d3.scaleLinear().range([height - margin.bottom, margin.top]).domain([minAltitude, Math.ceil(maxAltitude / 100) * 100 ]);

  // ETA Rectangle
  svg.append('g')
    .attr('class', 'bg-rect-eta' )
    .append("rect")
      .attr( 'x', x(startDate) )
      .attr( 'y', margin.top )
      .attr( 'width', x(endDateETA) )
      .attr( 'height', 25 )
      .style("fill", "#0e182a" )

  // Traffic Rectangle
  svg.append('g')
    .attr('class', 'bg-rect-traffic' )
    .append("rect")
      .attr( 'x', x(endDateETA) )
      .attr( 'y', margin.top )
      .attr( 'width', x(trafficEndDate) - x(endDateETA) )
      .attr( 'height', 25 )
      .style("fill", color_traffic )

  // Weather Rectangle
  svg.append('g')
    .attr('class', 'bg-rect-weather' )
    .append("rect")
      .attr( 'x', x(trafficEndDate) )
      .attr( 'y', margin.top )
      .attr( 'width', x(weatherEndDate) - x(trafficEndDate) )
      .attr( 'height', 25 )
      .style("fill", color_weather )

  // Curves Rectangle
  svg.append('g')
    .attr('class', 'bg-rect-curves' )
    .append("rect")
      .attr( 'x', x(weatherEndDate) )
      .attr( 'y', margin.top )
      .attr( 'width', x(curvesEndDate) - x(weatherEndDate) )
      .attr( 'height', 25 )
      .style("fill", color_curves )

  // Curves Rectangle
  svg.append('g')
    .attr('class', 'bg-rect-slopes' )
    .append("rect")
      .attr( 'x', x(curvesEndDate) )
      .attr( 'y', margin.top )
      .attr( 'width', x(slopesEndDate) - x(curvesEndDate) )
      .attr( 'height', 25 )
      .style("fill", color_slopes )

  



  // **** Origin and Destination

  svg.append('g')
    .attr('class', 'dest-text-title' )
    .append("text")
      .attr( 'x', x(endPTADate) )
      .attr( 'y', 15 )
      .text( "Destination" )
      .style("fill", "rgba(255,255,255,0.5)" )
      .style("text-anchor", "end" )

  svg.append('g')
    .attr('class', 'orig-text-title' )
    .append("text")
      .attr( 'x', x(startDate) )
      .attr( 'y', 15 )
      .text( "Origin" )
      .style("fill", "rgba(255,255,255,0.5)" )
      .style("text-anchor", "start" )

  svg.append('g')
    .attr('class', 'dest-text' )
    .append("text")
      .attr( 'x', x(endPTADate) )
      .attr( 'y', 30 )
      .text( toString.toProperCase() )
      .style("fill", "white" )
      .style("text-anchor", "end" )

  svg.append('g')
    .attr('class', 'orig-text' )
    .append("text")
      .attr( 'x', x(startDate) )
      .attr( 'y', 30 )
      .text( fromString.toProperCase() )
      .style("fill", "white" )
      .style("text-anchor", "start" )



  // **** Dates
  
  // Origin
  svg.append('g')
    .attr('class', 'orig-text' )
    .append("text")
      .attr( 'x', x(startDate) )
      .attr( 'y', 95 )
      .text( moment(startDate).format("HH:mm") )
      .style("fill", "white" )
      .style("text-anchor", "start" )

  svg.append('g')
    .attr('class', 'orig-text' )
    .append("text")
      .attr( 'x', x(startDate) )
      .attr( 'y', 110 )
      .text( moment(startDate).format("MMM D YYYY"))
      .style("fill", "rgba(255,255,255,0.5)" )
      .style("text-anchor", "start" )


  // ETA Date
  svg.append('g')
    .attr('class', 'eta-text' )
    .append("text")
      .attr( 'x', x(endDateETA) )
      .attr( 'y', 95 )
      .text( moment(endDateETA).format("HH:mm") )
      .style("fill", "white" )
      .style("text-anchor", "end" )

  // PTA Date
  svg.append('g')
    .attr('class', 'eta-text' )
    .append("text")
      .attr( 'x', x(endPTADate) )
      .attr( 'y', 95 )
      .text( moment(endPTADate).format("HH:mm") )
      .style("fill", "white" )
      .style("text-anchor", "end" )

  // svg.append('g')
  //   .attr('class', 'diff-text' )
  //   .append("text")
  //     .attr( 'x', x(endPTADate) )
  //     .attr( 'y', 150 )
  //     .text( "Difference " + beautifyTime(alltogether) + " min" )
  //     .style("fill", "white" )
  //     .style("text-anchor", "end" )     


  // Summary
  var tmp_et = estimate_duration;
  var tmp_pt = precise_duration;
  $('.eta-duration span.time').text( beautifyTime(tmp_et))
  $('.pta-duration span.time').text( beautifyTime(tmp_pt))
  $('.diff-duration span.time').text( beautifyTime(alltogether))
}

function initAltitudeChart ( route ) {
  
  if (dataReady < 3) return;

  var estimated_time = 0;
  for (var i = 0; i < route.length; i++) {
    estimated_time += route[i].travelTime;
  }
  
  $('.traffic-l').text( "Traffic: " + moment.duration(traffic_shifted_time, "seconds").minutes() + "min" )
  $('.weather-l').text( "Weather: " + moment.duration(weather_shifted_time, "seconds").minutes() + "min" )
  $('.slopes-l').text( "Slopes: " + moment.duration(slope_shifted_time, "seconds").minutes() + "min" )
  $('.curves-l').text( "Curves: " + moment.duration(curve_shifted_time, "seconds").minutes() + "min" )

  // console.log( "estimated:",estimated_time, "slopes:", slope_shifted_time, "curves:", curve_shifted_time, "traffic:", traffic_shifted_time, "weather:", weather_shifted_time );
  // console.log("Total time", estimated_time + slope_shifted_time + curve_shifted_time + traffic_shifted_time + weather_shifted_time )

  hideSpinner();

  svg.selectAll("*").remove()

  var startDate = route[0].date;
  var endDate = route[route.length-1].preciseDate;
  
  var minAltitude = 999999;
  var maxAltitude = -99999;

  for (var i = 0; i < route.length; i++) {
    maxAltitude = maxAltitude < route[i].position.alt? route[i].position.alt : maxAltitude;
    minAltitude = minAltitude > route[i].position.alt? route[i].position.alt : minAltitude; 
  };

  // Size
  var margin = {top: 30, bottom: 30, right: 50, left: 50};
  var width = $('.elevation-chart').width() - margin.right;
  var height = 200;

  
  svg.attr("width", '100%').attr("height", height )
  
 
  // Set Axis scales
  x = d3.scaleTime().domain([startDate, endDate]).range([ margin.left, width ]);
  y = d3.scaleLinear().range([height - margin.bottom, margin.top]).domain([minAltitude, Math.ceil(maxAltitude / 100) * 100 ]);


  // Background
  svg.append('g')
    .attr('class', 'bg-rect' )
    .append("rect")
      .attr( 'x', margin.left )
      .attr( 'y', 10 )
      .attr( 'width', width - margin.left )
      .attr( 'height', height - 40 )
      .style("fill", "rgba(31,41,59,0.7)" )

  // X axys ticks
  var ticks = []; 
  for (var i = 0; i < route.length; i++) {
    ticks[i] = route[i].preciseDate;
  };
  var xAxis = d3.axisBottom(x).tickSize( height - 40 ).tickFormat( d3.timeFormat("%H:%M"))

  // Y axys ticks
  var altTicks = [ parseInt(minAltitude),  parseInt(maxAltitude / 3), parseInt(maxAltitude / 1.5), parseInt(maxAltitude) ];

  svg.append('g')
  .attr('class', 'y-axys-log' )
    .selectAll( '.axys-value' ).data( altTicks ).enter()
    .append('text')
    .attr( 'x', margin.left - 10 )
    .attr( 'y', function (d) { return y(d); })
    .text(function (d){ 
      var value = Math.round(d / 10) * 10;
      return value + "m"; 
   })
    .attr("text-anchor", 'end' )
    .style("fill", "white")

  svg.append("g")
        .attr("class", "x-axis")
        .call(xAxis)
        .attr("transform", "translate(" + 0 + " ," + 10 + ")")
  
  svg.append('g')
    .attr('class', 'bottom-line' )
    .append("line")
      .attr( 'x1', margin.left )
      .attr( 'y1', height - 30 )
      .attr( 'x2', width )
      .attr( 'y2', height - 30 )
      .style("stroke", "black" )


   // ETA route
  svg.append('g')
  .attr('class', 'chart-truck' )
    .selectAll( '.chart-line-truck' ).data( route ).enter()
    .append( 'line' )
      .attr( 'class', 'chart-line-truck' )
      .attr( 'x1', function (d, i) { return x( route[i].date ) })
      .attr( 'y1', function (d, i) { return y( route[i].position.alt )})
      .attr( 'x2', function (d, i) { return x( route[i-1]? route[i-1].date : route[i].date )})
      .attr( 'y2', function (d, i) { return y( (route[i-1]? route[i-1].position.alt : route[i].position.alt) )})
      .style( 'stroke', "gray" )      
      .style( 'stroke-width', 1 )
      .style( 'stroke-linecap', 'round' )
      

  // Weather
  svg.append('g')
  .attr('class', 'chart-weather' )
    .selectAll( '.chart-line-weather' ).data( route ).enter()
    .append( 'line' )
      .attr( 'class', 'chart-line-weather' )
      .attr( 'x1', function (d, i) { return x( route[i].preciseDate ) })
      .attr( 'y1', function (d, i) { return y( route[i].position.alt )})
      .attr( 'x2', function (d, i) { return x( route[i-1]? route[i-1].preciseDate : route[i].preciseDate )})
      .attr( 'y2', function (d, i) { return y( (route[i-1]? route[i-1].position.alt : route[i].position.alt) )})
      .style( 'stroke', function (d, i) { 
        var color = "orange";
        var warning = Weather.isItOnPrecipitationList( route[i].weather.iconName );
        if (!warning) color = "transarent";
        return color;
      })
      .style( 'stroke-width', weather_thickness )
      .style( 'stroke-linecap', 'round' )
      .on("click", function (evt) {
        // console.log(evt.bounds)
        MapUtilities.setMapViewToBounds( evt.bounds, 1, 3 )
      })

  // Normal route
  svg.append('g')
  .attr('class', 'chart-truck' )
    .selectAll( '.chart-line-truck' ).data( route ).enter()
    .append( 'line' )
      .attr( 'class', 'chart-line-truck' )
      .attr( 'x1', function (d, i) { return x( route[i].preciseDate ) })
      .attr( 'y1', function (d, i) { return y( route[i].position.alt )})
      .attr( 'x2', function (d, i) { return x( route[i-1]? route[i-1].preciseDate : route[i].preciseDate )})
      .attr( 'y2', function (d, i) { return y( (route[i-1]? route[i-1].position.alt : route[i].position.alt) )})
      .style( 'stroke', "rgba(0,137,173,1)" )      
      .style( 'stroke-width', route_thickness )
      .style( 'stroke-linecap', 'round' )


  // SLOPES
  svg.append('g')
  .attr('class', 'chart-slopes' )
    .selectAll( '.chart-line-slopes' ).data( route ).enter()  
    .append( 'line' )
      .attr( 'class', 'chart-line-slopes' )
      .attr( 'x1', function (d, i) { return x( route[i].preciseDate ) })
      .attr( 'y1', function (d, i) { return y( route[i].position.alt )})
      .attr( 'x2', function (d, i) { return x( route[i-1]? route[i-1].preciseDate : route[i].preciseDate )})
      .attr( 'y2', function (d, i) { return y( (route[i-1]? route[i-1].position.alt : route[i].position.alt) )})
      .style( 'stroke', function (d, i) { 
        return route[i].slopes > 0? color_slopes : "transparent";
      })
      .style( 'stroke-width', slopes_thickness )
      .style( 'stroke-linecap', 'round' )
      .style( 'cursor', 'pointer' )
      .on("click", function (evt) {
        // console.log(evt.bounds)
        MapUtilities.setMapViewToBounds( evt.bounds, 1, 3 )
      })

  // CURVES
  svg.append('g')
  .attr('class', 'chart-curves' )
    .selectAll( '.chart-line-curves' ).data( route ).enter()  
    .append( 'line' )
      .attr( 'class', 'chart-line-curves' )
      .attr( 'x1', function (d, i) { return x( route[i].preciseDate ) })
      .attr( 'y1', function (d, i) { return y( route[i].position.alt )})
      .attr( 'x2', function (d, i) { return x( route[i-1]? route[i-1].preciseDate : route[i].preciseDate )})
      .attr( 'y2', function (d, i) { return y( (route[i-1]? route[i-1].position.alt : route[i].position.alt) )})
      .style( 'stroke', function (d, i) { 
        return route[i].curves > 0? color_curves : "transparent";
      })
      .style( 'stroke-width', curves_thickness )
      .style( 'stroke-linecap', 'round' )
      .style( 'cursor', 'pointer' )
      .on("click", function (evt) {
        // console.log(evt.bounds)
        MapUtilities.setMapViewToBounds( evt.bounds, 1, 3 )
      })

  // Traffic route
  svg.append('g')
  .attr('class', 'chart-traffic' )
    .selectAll( '.chart-line-traffic' ).data( route ).enter()  
    .append( 'line' )
      .attr( 'class', 'chart-line-traffic' )
      .attr( 'x1', function (d, i) { return x( route[i].preciseDate ) })
      .attr( 'y1', function (d, i) { return y( route[i].position.alt )})
      .attr( 'x2', function (d, i) { return x( route[i-1]? route[i-1].preciseDate : route[i].preciseDate )})
      .attr( 'y2', function (d, i) { return y( (route[i-1]? route[i-1].position.alt : route[i].position.alt) )})
      .style( 'stroke', function (d, i) { 
        return route[i].traffic > 5? "red" : "transparent";
      })
      .style( 'stroke-width', traffic_thickness )
      .style( 'stroke-linecap', 'round' )
      .style( 'cursor', 'pointer' )
      .on("click", function (evt) {
        // console.log(evt.bounds)
        MapUtilities.setMapViewToBounds( evt.bounds, 1, 3 )
      })
}


// ***** UI Interaction *****
// *********************************************

function removeObjects () {
  
  carRouteGroup.removeAll();
  carRouteDashedGroup.removeAll();
  carWeatherGroup.removeAll();
  carCurvesGroup.removeAll();
  carSlopeGroup.removeAll();
  carTrafficGroup.removeAll();
  
  truckRouteGroup.removeAll();
  truckRouteDashedGroup.removeAll();
  truckWeatherGroup.removeAll();
  truckCurvesGroup.removeAll();
  truckSlopeGroup.removeAll();
  truckTrafficGroup.removeAll();
  truckRestrictionGroup.removeAll();
  
  markersGroup.removeAll();

}

function updateInfoBubble ( title, description, eta, type, icon, x, y ) {

  $('.info-bubble').css({top: y - 95, left: x - 100 , opacity: 1 });
  $('.info-bubble .title').text(title)
  $('.info-bubble .title').removeClass("traffic-type weather-type slope-type curve-type");
  $('.info-bubble .title').addClass(type)
  $('.info-bubble .description').text( description )

  $('.info-bubble .eta').text("ETA affected by " + moment.duration(eta, "seconds").humanize() )
  if (eta === 0 ) $('.info-bubble .eta').text("")

  // if (icon != null) $('.weather-icon').html(icon)
  // else 
    $('.weather-icon').html("")
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

function initRouteSettingsUI () {

  $('.istruck').click( function (evt) {
    if ( $(this).is(':checked') ) {

      Routing.setVehicleType( "car" )
      routeOnFocus = c_divided;
      isTruck = false;
      carGroup.setZIndex(1)
      truckGroup.setZIndex(0)
      $('.dist').text(Routing.getTotalDistanceinKm(car_raw_route) + " Km")
      $('.co2').text(Routing.getTotalCO2Emissions(car_raw_route) + " Kg")

      carRouteDashedGroup.setVisibility(false);
      carRouteGroup.setVisibility(true);
      carWeatherGroup.setVisibility(true);
      carCurvesGroup.setVisibility(true);
      carSlopeGroup.setVisibility(true);
      carTrafficGroup.setVisibility(true);
      
      truckRouteDashedGroup.setVisibility(true);
      truckRouteGroup.setVisibility(false);
      truckWeatherGroup.setVisibility(false);
      truckCurvesGroup.setVisibility(false);
      truckSlopeGroup.setVisibility(false);
      truckTrafficGroup.setVisibility(false);
      truckRestrictionGroup.setVisibility(false);

    } else {

      Routing.setVehicleType( "truck" )
      routeOnFocus = t_divided;
      isTruck = true;
      carGroup.setZIndex(0)
      truckGroup.setZIndex(1)
      $('.dist').text(Routing.getTotalDistanceinKm(truck_raw_route) + " Km")
      $('.co2').text(Routing.getTotalCO2Emissions(truck_raw_route) + " Kg")

      carRouteDashedGroup.setVisibility(true);
      carRouteGroup.setVisibility(false);
      carWeatherGroup.setVisibility(false);
      carCurvesGroup.setVisibility(false);
      carSlopeGroup.setVisibility(false);
      carTrafficGroup.setVisibility(false);
    
      truckRouteDashedGroup.setVisibility(false);
      truckRouteGroup.setVisibility(true);
      truckWeatherGroup.setVisibility(true);
      truckCurvesGroup.setVisibility(true);
      truckSlopeGroup.setVisibility(true);
      truckTrafficGroup.setVisibility(true);
      truckRestrictionGroup.setVisibility(true);
    }

    initLineChart(routeOnFocus);
  })

  $('.tolls').click( function (evt) {
    Routing.setTolls( !$(this).is(':checked') )
  })

  $('.tunnels').click( function (evt) {
    Routing.setTunnel( !$(this).is(':checked') )
  })

  $('.motorways').click( function (evt) {
    Routing.setMotorways( !$(this).is(':checked') )
  })

  $('.frozen').click( function (evt) {
    Routing.setDirtRoad( !$(this).is(':checked') )
  })

  $('.traffic').click( function (evt) {
    Routing.setTraffic( !$(this).is(':checked') )
  })

  $('.btn-calculate').click(function (evt) {

    fromString = $('#routing-origin').val();
    toString = $('#routing-dest').val();

    if ( fromString == "" || toString == "" ) {
      $('#routing-origin').addClass("error");
      $('#routing-dest').addClass("error");
      return;
    } else {
      $('#routing-origin').removeClass("error");
      $('#routing-dest').removeClass("error");
    }
    
    
    $('.loading').show();

    var geocode_files = 0;

    Geocoder.search( fromString ).done( function ( result ) {
      setCookie("origin", fromString, 14 )
      // document.cookie ="origin=" + fromString;
      var f = Geocoder.getDisplayPosition(result);
      from.lat = f.Latitude;
      from.lng = f.Longitude;

      geocode_files++;
      if (geocode_files == 2)
        recalculate();
    })

    Geocoder.search( toString ).done( function ( result ) {
      setCookie("destination", toString, 14 )
      // document.cookie ="destination=" + toString;
      var t = Geocoder.getDisplayPosition(result);
      to.lat = t.Latitude;
      to.lng = t.Longitude;
      geocode_files++;
      if (geocode_files == 2)
        recalculate();
    })
  })
}

function recalculate () {
  $('.warning').hide();
  removeObjects();
  drawRoutes( from, to );
}

function initChartSettings () {
  $('.trafficflow').click( function (evt) {
    var current = isTruck? truckTrafficGroup : carTrafficGroup;
    current.setVisibility($(this).is(':checked'))
  })
  $('.slopes').click( function (evt) {
    var current = isTruck? truckSlopeGroup : carSlopeGroup;
    current.setVisibility($(this).is(':checked'))
  })
  $('.weather').click( function (evt) {
    var current = isTruck? truckWeatherGroup : carWeatherGroup;
    current.setVisibility($(this).is(':checked'))
  })
  $('.curves').click( function (evt) {
    var current = isTruck? truckCurvesGroup : carCurvesGroup;
    current.setVisibility($(this).is(':checked'))
  })
}


function hideSpinner () {
  $('.loading').hide();
}
function showSpinner () {
  $('.loading').show();
}



function initLegendInteractions(){

  $('.show-hide-button').click(function () {
    var legend_wrapper = $('.legend-wrapper');
    var tmp_button = $(this);

    if ( legend_wrapper.hasClass('minimize')) {
      legend_wrapper.removeClass('minimize')
      tmp_button.removeClass('minimize')

      $('#basemap').animate({
        fontSize: 14
      }, {
        duration: 500,
        step: function( now, fx ){
          map.getViewPort().resize();
        },
        complete: function () {
          map.getViewPort().resize();
        }
      });

	  $('#herelogo').fadeOut(50); 
      $('#basemap').css({bottom:300})
	  
	  $('#herelogo').animate({
        fontSize: 14
      }, {
        duration: 500,
		start: function()
		{
			
		},
        step: function( now, fx ){
        },
        complete: function () {
			$('#herelogo').css({bottom: 300});
			$('#herelogo').fadeIn(50); 
        }
      });

    } else {
      legend_wrapper.addClass('minimize')
      tmp_button.addClass('minimize')

      $('#basemap').css({bottom:0})
	  $('#herelogo').fadeOut(50); 
      
      $('#basemap').animate({
        fontSize: 0
      }, {
        duration: 500,
        step: function( now, fx ){
          map.getViewPort().resize();
        },
        complete: function () {
          map.getViewPort().resize();
        }
      });
	  $('#herelogo').animate({
        fontSize: 14
      }, {
        duration: 500,
		start: function()
		{
			
		},
        step: function( now, fx ){
        },
        complete: function () {
			$('#herelogo').css({bottom: 12});
			$('#herelogo').fadeIn(50); 
        }
      });
    }
  }) 
}


// ***** Utilities *****
// *********************************************

Array.prototype.containsArray = function(val) {
  var hash = {};
  for(var i=0; i<this.length; i++) {
      hash[this[i]] = i;
  }
  return hash.hasOwnProperty(val);
}


String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

String.prototype.camelToSentence = function () {
  return this.replace(/^[a-z]|[A-Z]/g, function(v, i) {
        return i === 0 ? v.toUpperCase() : " " + v.toLowerCase();
    });  // "This is not a pain"
}
    



// ***** VISUAL DEBUGER ***** 
// *********************************************

function drawLinks ( route ) {
  for (var i = 0; i < route.leg[0].link.length; i++) {

    var tmp_strip = new H.geo.Strip();
    var tmp_links_styles = {
      strokeColor: "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")",
      lineWidth: 5,
      lineCap: 'round',
      lineJoin: 'bevel'
    };

    var tmp_shape = route.leg[0].link[i].shape;
    for (var x = 0; x < tmp_shape.length; x++) {
      var tmp_parts = tmp_shape[x].split(',');
      tmp_strip.pushLatLngAlt( +tmp_parts[0], +tmp_parts[1], +tmp_parts[2] );
    };

    var poly = new H.map.Polyline( tmp_strip, { style: tmp_links_styles });
    truckRouteGroup.addObject(poly)
  };
}

function drawAltitude ( links, group ) {
    
  for (var l = 0; l < links.length; l++) {

    var tmp_shape = links[l].shape;
    var strip = new H.geo.Strip();
    
    for (var i = 0; i < tmp_shape.length; i++) {
      
      var parts = tmp_shape[i].split(',');
      strip.pushLatLngAlt( parts[0], parts[1], parts[2] );

      var normalize = MathUtilities.mapValues( parseInt(parts[2]), -30, 250, 0,0.99, true);
      var colors = ["yellow","green","red","purple"];
      var strokeColor = MathUtilities.lerpColors( colors, normalize );

      var tmp_styles = {
        strokeColor: strokeColor,
        // lineWidth: (normalize * 14) + 1,
        lineWidth: route_thickness,
        lineCap: 'round',
        lineJoin: 'bevel'
      };
    };

    var polyline = new H.map.Polyline( strip, { style: tmp_styles });
    polyline.metadata = parts[2];
    group.addObject(polyline);

  }
}
