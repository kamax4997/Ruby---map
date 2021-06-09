var MapUtilities = {

  basemap:            null,
  defaultLayer:       null,
  platform:           null,
  customLabelsLayer:  null,
  behavior:           null,

  setup: function () {
    if ( AppCore.credentials )
      this.platform = AppCore.platform;
    else 
      console.warn("You need to setup your credentials in AppCore class")
  },

  addMap: function ( div, props ) {

    var hidpi = ( "devicePixelRatio" in window && devicePixelRatio > 1);
    var maptiler = this.platform.getMapTileService();
    defaultLayer = this.platform.createDefaultLayers();

    var mapTileOptions = ["maptile", "basetile", "xbasetile", "alabeltile", "labeltile", "linetile", "streettile", "lltile", "trucktile", "truckonlytile" ];
    var styleOptions = ["default", "dreamworks", "fleet", "flame", "mini", "wings" ];
    var ppiOptions = [72,100,320,500];

    var tmp_tileType = props.tileType? props.tileType : "basemap";
    var tmp_style = props.style? props.style : "default";
    var tmp_scheme = props.scheme? props.scheme : "normal.day";
    var tmp_layer_options = { style: tmp_style, ppi: props.ppi? props.ppi : ( hidpi? 320 : 72 ), lg: props.language? props.language : 'eng'};

    // Labels on top
    var labels = maptiler.createTileLayer( "labeltile", tmp_scheme, 512, "png", tmp_layer_options );
    labels.setMin( props.minZoom? props.minZoom : 3 );
    labels.setMax( props.maxZoom? props.maxZoom : 20);

    var truckTile = maptiler.createTileLayer( "truckonlytile", tmp_scheme, 512, "png", tmp_layer_options );

    // Map layer
    var layer = maptiler.createTileLayer( tmp_tileType, tmp_scheme, 512, "png", tmp_layer_options );
    layer.setMin( props.minZoom? props.minZoom : 3 );
    layer.setMax( props.maxZoom? props.maxZoom : 20);

    var map = new H.Map(document.getElementById( div ), layer, {
      center: props.center,
      zoom: props.zoom,
      padding: props.padding? props.padding : {top:0, left:0, right:0, bottom:0},
      pixelRatio: (hidpi? 2 : 1),
      layers: props.labels? [labels] : null,
      // layers: [truckTile],
      imprint: props.imprint? props.imprint : null,
      fixedCenter: props.fixedCenter? props.fixedCenter : true
    });
    
    window.addEventListener("resize", function() { 
      MapUtilities.basemap.getViewPort().resize(); 
    });
    
    var mapEvents = new H.mapevents.MapEvents(map); // Enable the map event system
    this.behaviors = new H.mapevents.Behavior(mapEvents);  // Enable map interaction (pan, zoom, pinch-to-zoom)

    this.basemap = map;
    return map;
  },

  behaviorEnabled: function ( bool ) {
    if (bool)
      this.behaviors.enable();
    else
      this.behaviors.disable();
  },

  showTraffic: function () {
    this.basemap.setBaseLayer( defaultLayer.normal.traffic );
  },

  restrictMapTo: function ( bounds, debugMode ) {

    var map = this.basemap;
    
    map.getViewModel().addEventListener( 'sync', function() {

      var center = map.getCenter();  

      if (!bounds.containsPoint(center)) {
        if (center.lat > bounds.getTop()) center.lat = bounds.getTop();
        else if (center.lat < bounds.getBottom()) center.lat = bounds.getBottom();
        if (center.lng < bounds.getLeft()) center.lng = bounds.getLeft();
        else if (center.lng > bounds.getRight()) center.lng = bounds.getRight();
        map.setCenter(center);
      }
    });

    if ( debugMode ) {
      //Debug code to visualize where your restriction is
      var style_options = { style:{fillColor: 'rgba(0, 0, 0, 0.1)', strokeColor: 'rgba(255, 255, 255, 0.6)', lineWidth: 1}};
      this.basemap.addObject( new H.map.Rect( bounds, style_options ));
    }
  },


  setMapViewToBounds: function ( bounds, seconds, offset ) {
    
    // add functionality: pass parameter as an object
    // add CompleteCallback functionality
    // add OnFrame method functinality

    var map = this.basemap;
    var camera_data = map.getCameraDataForBounds( bounds );
    var tmp_pos = new H.geo.Point( camera_data.position.lat, camera_data.position.lng );

    // start from the current position
    var lat = map.getCenter().lat;
    var lng = map.getCenter().lng;

    // Create a temporaty object to animate
    var params = { 
      targetZoom: map.getZoom(),
      latitude: lat,
      longitude: lng
    };

    var zoom_offset = offset? offset : 0.5;

    // animate the object
    $( params ).animate({
      targetZoom: camera_data.zoom - zoom_offset,
      latitude: tmp_pos.lat,
      longitude: tmp_pos.lng
    }, {

    duration: seconds * 1000,
    easing: "easeInOutCubic",

    step: function( now, fx ){

      if (fx.prop === "targetZoom") map.setZoom(now);
      if (fx.prop === "latitude") lat = now;
      if (fx.prop === "longitude") lng = now;

      var tmp_center = new H.geo.Point( lat, lng );
      map.setCenter( tmp_center );

    },
      complete: function () {
       
      }
    });
  },

  setMapPositionAndZoom: function ( center, zoom, time ) {

    // add functionality: pass parameter as an object
    // add CompleteCallback functionality
    // add OnFrame method functinality

    var map = this.basemap;

    // start from the current position
    var lat = map.getCenter().lat;
    var lng = map.getCenter().lng;

    // Create a temporaty objetc to animate
    var params = { 
      targetZoom: map.getZoom(),
      latitude: lat,
      longitude: lng
    };    

    // animate the object
    $( params ).animate({
      targetZoom: zoom,
      latitude: center.lat,
      longitude: center.lng
    },{
      duration: time,
      easing: "easeOutCubic",

      step: function( now, fx ){

        if (fx.prop === "targetZoom") map.setZoom(now);
        if (fx.prop === "latitude") lat = now;
        if (fx.prop === "longitude") lng = now;

        var tmp_center = new H.geo.Point( lat, lng );
        map.setCenter( tmp_center );

      },
      complete: function () {
        console.log("complete")// map.getViewPort().resize();
      }
    });
  }
}