var Traffic = {
  
  baseURL: "https://traffic.api.here.com/traffic/6.0/incidents.json?",
  credentials: null,
  app_code: null,
  map: null,

  setup: function () {
    if ( AppCore.credentials )
      this.platform = AppCore.platform;
    else {
      console.error("Need to set your credentials in AppCore")
      return;
    }
  },

  getTrafficIncidents: function ( rect, criticality ) {

    var deferred = $.Deferred();
    var topLeft = rect.getTopLeft();
    var bottomRight = rect.getBottomRight();

    var tmp_params = {
      bbox: '' + topLeft.lat +','+ topLeft.lng + ';' + bottomRight.lat + ',' + bottomRight.lng,
      criticality: criticality,
      app_id: this.credentials.app_id,
      app_code: this.credentials.app_code
    };
    
    var tmp_url = this.baseURL + $.param( tmp_params );

    $.ajax({
      url : tmp_url,
      dataType: 'JSONP',
      jsonp : 'jsonCallback',
      type: 'GET',
      complete: function (response) {
        deferred.resolve( response );
      }
    });

    return deferred.promise();

  },

  getTraffic: function ( divided, i ) {

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
          app_id: this.credentials.app_id, 
          app_code: this.credentials.app_code,
          jsonAttributes:39,
          corridor: corridorString,
          minjamfactor: 2.0,
          responseattributes: 'sh,fc'
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

}