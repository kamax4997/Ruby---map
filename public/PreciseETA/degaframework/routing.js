var Routing = {

  // map:        null,
  platform:   null,
  params:     null,
  router:     null,
  polyline:   null,

  // INTERNAL
  i_vehicle_type: 'car',
  i_traffic: 'enabled',
  i_tollroad:0,
  i_motorway:0,
  i_boatFerry:0,
  i_railFerry:0,
  i_tunnel:0,
  i_dirtRoad:0,
  i_park:0,
  i_alternative:0,
  i_engine_type: "gasoline",
  i_consumtion: 5.5,
  i_trailer_count: 0,
  i_height:4.4,
  i_width:3.2,
  i_length:20,

  setup: function () {

    if ( AppCore.credentials )
      this.platform = AppCore.platform;
    else {
      console.error("Need to set your credentials in AppCore")
      return;
    }

    this.router = this.platform.getRoutingService();
    this.updateParams();

    this.errorHandler = function(e) {
      console.error(e);
    };
  },


  // Option: [car | pedestrian | carHOV | publicTransport | publicTransportTimeTable | truck | bicycle ]
  setVehicleType: function ( vehicleType ) {
    this.i_vehicle_type = vehicleType;
    this.updateParams();
  },

  setTraffic: function ( bool ) {
    this.i_traffic = bool? 'enabled' : 'disabled';
    this.updateParams();
  },

  // -3  strictExclude The routing engine guarantees that the route does not contain strictly excluded features. If the condition cannot be fulfilled no route is returned.
  // 0   normal The routing engine does not alter the ranking of links containing the corresponding feature.
  setTolls: function ( bool ) {
    this.i_tollroad = bool? 0 : -3;
    this.updateParams();
  },

  setMotorways: function ( bool ) {
    this.i_motorway = bool? 0 : -3;
    this.updateParams();
  },

  setFerry: function ( bool ) {
    this.i_boatFerry = bool? 0 : -3;
    this.i_railFerry = bool? 0 : -3;
    this.updateParams();
  },

  setTunnel: function ( bool ) {
    this.i_tunnel = bool? 0 : -3;
    this.updateParams();
  },

  setDirtRoad: function ( bool ) {
    this.i_dirtRoad = bool? 0 : -3;
    this.updateParams();
  },

  setPark: function ( bool ) {
    this.i_park = bool? 0 : -3;
    this.updateParams();
  },

  setAmountOfAlternative: function ( int_alternatives ) {
    this.i_alternative = int_alternatives;
    this.updateParams();
  },

  // [diesel | gasoline | electric];
  setEngineType: function ( engineType ) {
    this.i_engine_type = engineType;
    this.updateParams();
  },

  // Newest models are: Gasline 6L | Diesel: between 3.0L - 5.2L
  setEnergyConsumption: function ( liters ) {
    this.i_consumtion = liters;
    this.updateParams();
  },

  setTrailerCount: function ( count ) {
    this.i_trailer_count = count;
    this.updateParams();
  },
  
  setSizeOfTruck:function ( width, height, length ) {
    this.i_width = width;
    this.i_height = height;
    this.length = length;
    this.updateParams();
  },

  updateParams: function () {
    var route_mode =  'fastest;' + 
                      this.i_vehicle_type + ';' + 
                      'traffic:' + this.i_traffic + ';' +
                      'tollroad:' + this.i_tollroad + ',' + 
                      'motorway:' + this.i_motorway + ',' +
                      'boatFerry:' + this.i_boatFerry + ',' +
                      'railFerry:' + this.i_railFerry + ',' +
                      'tunnel:' + this.i_tunnel + ',' +
                      'dirtRoad:' + this.i_dirtRoad + ',' +
                      'park:' + this.i_park;

    this.params = {
      mode: route_mode,
      trailersCount: this.i_internal_trailer_count,
      representation: 'display',
      routeattributes: 'sc,sm,sh,bb,lg,no,shape',
      legattributes: 'li',
      linkattributes: 'sh,nl,fc,sl,tr',
      alternatives: this.i_alternative,
      vehicletype: this.i_engine_type + "," + this.i_consumtion,
      width: this.i_width,
      height: this.i_height,
      length: this.i_length
    };
  },

  getTotalCO2Emissions: function ( result ) {
    // Co2 emissions avegare every 100km, 
    // so we divide the distance every 100km and multiply by the co2 emission to get the total
    return ((this.getCO2Emissions(result) * this.getTotalDistanceinKm(result)) / 100).toFixed(2);
  },

  getCO2Emissions: function ( result ) {
    // Unit is Kilograms
    return (this.getRoute(result).summary.co2Emission).toFixed(2);
  },

  getTotalDistanceinKm: function ( result  ) {
    // result comes on meters, divide by 1000 to get kms
    return (this.getRoute(result).summary.distance / 1000).toFixed(2);
  },

  getBoundingBox: function ( result ) {
    return this.getRoute(result).boundingBox;
  },

  getRoute: function ( result ) {
    return result.response.route[0];
  },

  getLinks: function ( result ){
    return this.getRoute(result).leg[0].link;
  },

  getShape: function ( result ) {
    return this.getRoute(result).shape;
  },

  calculate: function ( from, to, callback ) {
    this.router.calculateRoute($.extend({}, this.params, {
      waypoint0: from.lat + ',' + from.lng,
      waypoint1: to.lat   + ',' + to.lng,
      returnelevation: true
    }), callback, this.errorHandler);
  },

  divide: function (route, minutes, start) {

    // Better to include the original route
    // divided:{ originalRoute: route, timeBuckets: 5, routesOfRoutes:[]) }

    if (start === undefined) start = moment();
    if (minutes === undefined) minutes = 60;

    var startDate = new Date( moment().toString() )
    var seconds    = minutes * 60;
    var maneuvers  = route.leg[0].maneuver;
    var totalTime  = maneuvers.reduce(function(sum, item){ return sum + item.travelTime; }, 0);

    var travelTime = 0;
    var result     = [];
    var distancePos = 0;

    maneuvers.forEach(function(item, key) {
      
      travelTime += item.travelTime;
      var last = result[result.length - 1]? result[result.length - 1].travelTime : 0;
      var timeDiff = travelTime - last;
      var time_shift = 0;

      // we divide the total time of the manuver in x minute chunks
      var l = Math.floor( timeDiff / seconds );
      var traffic_notes = [];
      for (var i = 0; i < item.note.length; i++) {
        traffic_notes.push(item.note[i])
      };

      var tmp_distance = item.length;
      distancePos += item.length;

      for (var i = 0; i < l; i++ ) {

        var time = last + i * seconds;
        var nextTime = last + (i + 1) * seconds;

        // Date
        var tmpDate = new Date( moment(startDate).add( time, "seconds").toString() )
        
        // And we split the route in this chunks of time
        var parts = route.shape[Math.floor(time * route.shape.length / totalTime)];
        var parts2 = route.shape[Math.ceil(nextTime * route.shape.length / totalTime)];

        if (parts == null || parts2 == null ) break;
        
        var index1 = route.shape.indexOf(parts);
        var index2 = route.shape.indexOf(parts2);
        var tmpShape = route.shape.slice(index1,index2);
        
        // Each piece of route is compose os one or many links
        // We want to find which links belongs to each pieace of the route
        var tmpLinks = route.leg[0].link;
        var firstLinkCoords = tmpShape[0];
        var lastLinkCoords = tmpShape[tmpShape.length - 1];
        var firstLinkIndex = 0;
        var lastLinkIndex = 0;

        for (var x = 0; x < tmpLinks.length; x++) {
          for (var m = 0; m < tmpLinks[x].shape.length; m++) {
            if (tmpLinks[x].shape[m] === firstLinkCoords ) {
              firstLinkIndex = x;
              break;
            }
          }
        }

        for (var x = 0; x < tmpLinks.length; x++) {
          for (var m = 0; m < tmpLinks[x].shape.length; m++) {
            if (tmpLinks[x].shape[m] === lastLinkCoords ) {
              lastLinkIndex = x;
              break;
            }
          }
        }

        var linksGroup = tmpLinks.slice(firstLinkIndex,lastLinkIndex);
        var restrictions_array = [];
        for (var j = 0; j < linksGroup.length; j++) {
          if (linksGroup[j].truckRestrictions != undefined )
            restrictions_array.push({ restriction: linksGroup[j].truckRestrictions, position: linksGroup[j].shape[0] })
        };
      
        parts = parts.split(",");
        parts2 = parts2.split(",");


        // Calculating the distance traveled
        // var tmp_distance = item.length;
        // // for (var b = 0; b < tmpShape.length - 1; b++) {
        //   // var tmp_coord1 = tmpShape[0].split(",");
        //   // var tmp_coord2 = tmpShape[tmpShape.length - 1].split(",");
        //   // tmp_distance += MathUtilities.distanceBetweenCoordinates({lat:tmp_coord1[0],lng:tmp_coord1[1]}, {lat:tmp_coord2[0],lng:tmp_coord2[1]}) 
        // // };

        // distancePos += item.length;

        result.push({
          travelTime: time,
          distance: tmp_distance, 
          distanceTraveled: distancePos,
          date: tmpDate,
          preciseDate: tmpDate,
          links: linksGroup,
          restrictions: restrictions_array,
          shape:tmpShape,
          weather: { humidity:0, temperature:0, iconName:"", iconLink:"" },
          position: { lat: +parts[0], lng: +parts[1], alt: +parts[2]},
          trafficMessages:traffic_notes,
          speedLimit: null,
          traffic:null,
          slopes: 0,
          curves: 0,
          bounds: null
        });

      }
    });
    
    return result;

  }


  // clear: function () {
  //   if (this.polyline) {
  //     map.removeObject(this.polyline);
  //     this.polyline = null;
  //   }
  // },


  // draw: function ( shape, styles ) {
    
  //   var strip = new H.geo.Strip();
      
  //   shape.forEach( function ( point ) {
  //     var parts = point.split(',');
  //     strip.pushLatLngAlt( parts[0], parts[1] );
  //   });

  //   this.polyline = new H.map.Polyline(strip, { style: styles });

  //   // Add the polyline to the map
  //   // map.addObject(this.polyline);

  //   return this.polyline;

  // }
}