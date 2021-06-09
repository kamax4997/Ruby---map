var Geocoder = {

  platform:   null,
  geocoder:   null,

  setup: function ( credentials ) {

    if ( AppCore.credentials )
      this.platform = AppCore.platform;
    else 
      console.log("Need to set your credentials in AppCore")

    this.geocoder = this.platform.getGeocodingService();

    this.errorHandler = function(e) {
      console.log(e);
    };

  },

  search: function ( address ) {
    var deferred = $.Deferred();
    this.geocoder.search({ searchtext: address }, function (response) {
      deferred.resolve( response );
    }, this.errorHandler );
    return deferred.promise();
  },

  getMapView: function (response) {
    var bottom_right = response.Response.View[0].Result[0].Location.MapView.BottomRight;
    var top_left = response.Response.View[0].Result[0].Location.MapView.TopLeft;
    return new H.geo.Rect( top_left.Latitude, top_left.Longitude, bottom_right.Latitude, bottom_right.Longitude );
  },

  reverseGeocoding: function ( latitude, longitude ) {

    var deferred = $.Deferred();
    this.geocoder.reverseGeocode( { lat: latitude, lon: longitude, mode: "retrieveAddresses" , prox: ("" + latitude + "," + longitude + "," + 1000) }, function (response) {
      deferred.resolve( response );
    }, this.errorHandler );

    return deferred.promise();

  },


  getGeoshapeFrom: function ( searchText, shapeLevel ) {
    //  [country, state, county, city, district, street, houseNumber, postalCode, addressLines, additionalData]
    var deferred = $.Deferred();
    
    this.geocoder.geocode({
      searchText: searchText,
      additionalData: "IncludeShapeLevel," + shapeLevel,
      maxResults: 1,
      jsonattributes: 1,
      requestId: shapeLevel

    }, function (result) {

      var shapeText = result.response.view[0].result[0].location.shape.value;
      var infoObj = result.response.view[0].result[0].location.address;
      var obj = { info:infoObj, shape: shapeText };

      deferred.resolve( obj );
    }, this.errorHandler );

    return deferred.promise();

  },


  // Return the latotude-longitude
  getDisplayPosition: function ( response ) {
  	return response.Response.View[0].Result[0].Location.DisplayPosition;
  }, 

  // Return the address
  getAddress: function ( response ) {
  	return response.Response.View[0].Result[0].Location.Address;
  },

  // Take a look on how to ask the server for admin shapes
  getRawResponse: function ( response ) {
  	return response.Response.View[0].Result[0];
  }

}