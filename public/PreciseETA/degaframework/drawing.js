var Drawing = {

  shape: null,
  info: null,

  // Create a SVG marker
  drawMarker: function ( props ) {
    var tmp_icon 
	
	// why the Icon doesn't have a set Anchor?
	if(props.anchor != null)
		tmp_icon = new H.map.Icon( props.svg, { size: new H.math.Size( props.size.width * AppCore.ppi, props.size.height * AppCore.ppi), anchor: props.anchor}); 
	else
		tmp_icon = new H.map.Icon( props.svg, { size: new H.math.Size( props.size.width * AppCore.ppi, props.size.height * AppCore.ppi)}); 
    return new H.map.Marker( {lat: props.coords.lat, lng: props.coords.lng },{ icon: tmp_icon });
  },

  drawPolyline: function ( strip, styles ) {

    var polyline = new H.map.Polyline( strip, { style: styles.normal });

    if (styles.hover){
      // styles.hover.lineWidth *= AppCore.ppi;
      polyline.addEventListener('pointerenter', function (evt) {
        evt.target.setStyle( evt.target.styles.hover );
      })
    }

    if (styles.normal){
      // styles.normal.lineWidth *= AppCore.ppi;
      polyline.addEventListener('pointerleave', function (evt) {
        evt.target.setStyle( evt.target.styles.normal );
      })
      polyline.styles = styles;
    }
    return polyline;
  },

  greatCircle: function ( origin, destination, resolution, styles, map ) {

    var tmp_loc = [];

    for ( var x = 0; x <= resolution; x++) {
      var f = x/resolution;
      tmp_loc.push( MathUtilities.interpolate( origin, destination, f ));
    }

    var strip = new H.geo.Strip();
    for (var c = 0; c < tmp_loc.length; c++) {
      strip.pushLatLngAlt( tmp_loc[c].lat, tmp_loc[c].lng );
    };

    this.polyline = new H.map.Polyline(strip, { style: styles.normal });
    this.polyline.styles = styles;
    this.polyline.data = styles.data;


    var mouseEnter = function ( evt ) {

        // console.log( evt.originalEvent.clientX, evt.originalEvent.clientY )
        $('.info-bubble').html("<strong>"+evt.target.data[4]+"</strong> refugees travel from <strong>"+evt.target.data[2]+"</strong> to <strong>"+evt.target.data[3]+"</strong>")
        $('.info-bubble').css({
          left: evt.originalEvent.clientX + 20,
          top: evt.originalEvent.clientY - 20,
          opacity: 1
        })
        //   Stroke color
        var obj_styles = evt.target.styles;
        var strokeColor = chroma( obj_styles.normal.strokeColor )._rgb;
        var strokeColorHover = chroma( obj_styles.hover.strokeColor )._rgb;
        
        //   Stroke weight
        var strokeWeight = obj_styles.normal.lineWidth;
        var strokeWeightHover = obj_styles.hover.lineWidth; 

        var animProps = { 
          sr: strokeColor[0], sg:strokeColor[1], sb:strokeColor[2], sa:strokeColor[3],
          lineWidth: strokeWeight
        };
        
        $( animProps ).animate({ 
            sr:strokeColorHover[0], sg:strokeColorHover[1],sb:strokeColorHover[2],sa:strokeColorHover[3],
            lineWidth:strokeWeightHover
          }, { 

          duration: obj_styles.duration? obj_styles.duration : 500,
          easing: 'swing',
          step:function (now, fx) {
            
              // get the color of the selected shape
              var nsc = evt.target.styles.hover;

              nsc.strokeColor = 'rgba(' + Math.round(animProps.sr) + 
                ',' + Math.round(animProps.sg) + 
                ',' + Math.round(animProps.sb) + 
                ',' + animProps.sa + ')';

              nsc.lineWidth = animProps.lineWidth;
              evt.target.setStyle( nsc );
          }
        });
      };

      var mouseOut = function ( evt ) {

        $('.info-bubble').css({
          left: 0,
          top: 0,
          opacity: 0
        })

        //   Stroke color
        var obj_styles = evt.target.styles;
        var strokeColor = chroma(obj_styles.normal.strokeColor)._rgb;
        var strokeColorHover = chroma(obj_styles.hover.strokeColor)._rgb;
        
        //   Stroke weight
        var strokeWeight = obj_styles.normal.lineWidth;
        var strokeWeightHover = obj_styles.hover.lineWidth; 

        // If not, animate
        var animProps = {
          sr:strokeColorHover[0], sg:strokeColorHover[1],sb:strokeColorHover[2],sa:strokeColorHover[3],
          lineWidth:strokeWeightHover
        };

        $( animProps ).animate({ 
          sr:strokeColor[0], sg:strokeColor[1],sb:strokeColor[2],sa:strokeColor[3],
          lineWidth:strokeWeight
        }, { 

          duration: obj_styles.duration? obj_styles.duration : 500,
          easing: 'swing',

          step: function (now, fx) {

            var nsc = obj_styles.normal;

            nsc.lineWidth = animProps.lineWidth;
            nsc.strokeColor = 'rgba(' + Math.round(animProps.sr) 
              + ',' + Math.round(animProps.sg) 
              + ',' + Math.round(animProps.sb) 
              + ',' + animProps.sa 
              + ')';
        
            evt.target.setStyle( nsc );
          }
        });
      };

      this.polyline.addEventListener('pointerenter', mouseEnter );
      this.polyline.addEventListener('pointerleave', mouseOut );
      map.addObject(this.polyline);
  },

  drawBezier: function ( origin, destination, styles, resolution, map ) {

      var strip = new H.geo.Strip();
      var arrow_strip = new H.geo.Strip();
      var tmp_arc = styles.arcAmount? styles.arcAmount : 0.38;
      var group = new H.map.Group;
      var another_styles;
      var offset = styles.normal.lineWidth + styles.doubleStroke.offsetWidth;

      if (styles.doubleStroke) {
        another_styles = {
          normal: {
            strokeColor: 'rgba(0,0,0,0.5)',
            lineWidth:  offset
          }
        }
      }

      for (var i = 0; i < resolution; i++) {
          
          var p = map.geoToScreen(origin);
          var p2 = map.geoToScreen(destination );
          var arcAmount = MathUtilities.distance(p2, p) * tmp_arc;
          var current = i/resolution;
          var curve = new Bezier(p.x, p.y, p.x, p.y - arcAmount, p2.x, p2.y - arcAmount, p2.x, p2.y);
          var partialCurve = curve.split(0, current.toFixed(2));
          var coord = map.screenToGeo(partialCurve.points[3].x, partialCurve.points[3].y );
          strip.pushLatLngAlt( coord.lat, coord.lng );

      };


      this.polyline = new H.map.Polyline(strip, { style: styles.normal, 
                                                  arrows:{ color:"#FFFFFF", width:2, length:3, frequency:30} 
                                                });
      this.polyline.styles = styles;
      this.polyline.name = "polyline"
      this.polyline.data = styles.data;
      
      this.stroke_polyline = new H.map.Polyline(strip, { style: another_styles.normal } );
      this.polyline.name = "stroke_polyline";
      
      // if (styles.doubleStroke){
        this.stroke_polyline.styles = another_styles.normal;
        // group.addObject(this.stroke_polyline);
      // }
      group.addObject(this.polyline);
      // group.addObject( new H.map.Polygon( arrow_strip, { style: { fillColor: '#FFFFCC', strokeColor: '#829', lineWidth: 1 }}) )


      var mouseEnter = function ( evt ) {

        // console.log( evt.originalEvent.clientX, evt.originalEvent.clientY )
        $('.info-bubble').html("<strong>"+evt.target.data[4]+"</strong> refugees traveled from <strong>"+evt.target.data[2]+"</strong> to <strong>"+evt.target.data[3]+"</strong>")
        $('.info-bubble').css({
          left: evt.originalEvent.clientX + 20,
          top: evt.originalEvent.clientY - 20,
          opacity: 1
        })

        //   Stroke color
        var obj_styles = evt.target.styles;
        var strokeColor = chroma( obj_styles.normal.strokeColor )._rgb;
        var strokeColorHover = chroma( obj_styles.hover.strokeColor )._rgb;
        
        //   Stroke weight
        var strokeWeight = obj_styles.normal.lineWidth;
        var strokeWeightHover = obj_styles.hover.lineWidth; 

        var animProps = { 
          sr: strokeColor[0], sg:strokeColor[1], sb:strokeColor[2], sa:strokeColor[3],
          lineWidth: strokeWeight
        };
        
        $( animProps ).animate({ 
            sr:strokeColorHover[0], sg:strokeColorHover[1],sb:strokeColorHover[2],sa:strokeColorHover[3],
            lineWidth:strokeWeightHover
          }, { 

          duration: obj_styles.duration? obj_styles.duration : 500,
          easing: 'swing',
          step:function (now, fx) {
            
              // get the color of the selected shape
              var nsc = evt.target.styles.hover;

              nsc.strokeColor = 'rgba(' + Math.round(animProps.sr) + 
                ',' + Math.round(animProps.sg) + 
                ',' + Math.round(animProps.sb) + 
                ',' + animProps.sa + ')';

              nsc.lineWidth = animProps.lineWidth;
              evt.target.setStyle( nsc );
          }
        });
      };

      var mouseOut = function ( evt ) {

        $('.info-bubble').css({
          left: 0,
          top: 0,
          opacity: 0
        })

        //   Stroke color
        var obj_styles = evt.target.styles;
        var strokeColor = chroma(obj_styles.normal.strokeColor)._rgb;
        var strokeColorHover = chroma(obj_styles.hover.strokeColor)._rgb;
        
        //   Stroke weight
        var strokeWeight = obj_styles.normal.lineWidth;
        var strokeWeightHover = obj_styles.hover.lineWidth; 

        // If not, animate
        var animProps = {
          sr:strokeColorHover[0], sg:strokeColorHover[1],sb:strokeColorHover[2],sa:strokeColorHover[3],
          lineWidth:strokeWeightHover
        };

        $( animProps ).animate({ 
          sr:strokeColor[0], sg:strokeColor[1],sb:strokeColor[2],sa:strokeColor[3],
          lineWidth:strokeWeight
        }, { 

          duration: obj_styles.duration? obj_styles.duration : 500,
          easing: 'swing',

          step: function (now, fx) {

            var nsc = obj_styles.normal;

            nsc.lineWidth = animProps.lineWidth;
            nsc.strokeColor = 'rgba(' + Math.round(animProps.sr) 
              + ',' + Math.round(animProps.sg) 
              + ',' + Math.round(animProps.sb) 
              + ',' + animProps.sa 
              + ')';
        
            evt.target.setStyle( nsc );
          }
        });
      };

      this.polyline.addEventListener('pointerenter', mouseEnter );
      this.polyline.addEventListener('pointerleave', mouseOut );

      // map.addObject(group);
      return group;

  },

  // Create a SVG marker
  createSVGMarkers: function ( props ) {
    var tmp_icon = new H.map.Icon( props.svg, { size: new H.math.Size( props.size.width * AppCore.ppi, props.size.height * AppCore.ppi) }); 
    return new H.map.Marker( {lat: props.latitude, lng: props.longitude },{ icon: tmp_icon });
  },

  // Draw a polygon over a map
	drawPolygon: function ( jsonShape, styles, metadata ) {

    var duration = styles.hasOwnProperty('duration')? styles.duration : 400;
    var easing = styles.hasOwnProperty('ease')? styles.ease : 'easeInOutCubic';
    this.info = metadata;

    var mouseEnterStyle = function ( evt ) {
      
      // is the shape is selected, them do nothing
      if ( evt.target.isSelected ) return;

      console.log(evt.target.metadata);

      //   Fill color
      var fillColor = chroma(evt.target.styles.normal.fillColor)._rgb;
      var fillColorHover = chroma(evt.target.styles.hover.fillColor)._rgb;

      //   Stroke color
      var strokeColor = chroma(evt.target.styles.normal.strokeColor)._rgb;
      var strokeColorHover = chroma(evt.target.styles.hover.strokeColor)._rgb;
      
      //   Stroke weight
      var strokeWeight = evt.target.styles.normal.lineWidth;
      var strokeWeightHover = evt.target.styles.hover.lineWidth; 


      // Get the parent group
      var tmp_group = shape.getParentGroup();
      tmp_group.setZIndex(500);

      //  Get all the shapes on this group
      var tmp_objects = tmp_group.getObjects();

      var animProps = { 
        r: fillColor[0], g:fillColor[1], b:fillColor[2], a:fillColor[3], 
        sr: strokeColor[0], sg:strokeColor[1], sb:strokeColor[2], sa:strokeColor[3],
        lineWidth: strokeWeight
      };
      
      $( animProps ).animate({ 
          r:fillColorHover[0], g:fillColorHover[1], b:fillColorHover[2], a:fillColorHover[3], 
          sr:strokeColorHover[0], sg:strokeColorHover[1],sb:strokeColorHover[2],sa:strokeColorHover[3],
          lineWidth:strokeWeightHover
        }, { 

        duration: duration,
        easing: easing,
        step:function (now, fx) {
          
          // get the color of the selected shape
          var nsc = evt.target.styles.hover;

          nsc.fillColor = 'rgba(' + Math.round(animProps.r) + ',' + Math.round(animProps.g) + ',' + Math.round(animProps.b) + ',' + animProps.a + ')';
          nsc.strokeColor = 'rgba(' + Math.round(animProps.sr) + ',' + Math.round(animProps.sg) + ',' + Math.round(animProps.sb) + ',' + animProps.sa + ')';
          nsc.lineWidth = animProps.lineWidth;
          nsc.lineJoin = 'round';
          
          // Assign the color to all the objects
          for (var x = 0; x < tmp_objects.length; x++) 
            if (!tmp_objects[x].isSelected)
              tmp_objects[x].setStyle( nsc );
        }
      });
    };
    

    var mouseOutStyle = function ( evt ) {

      // is the shape is selected, them do nothing
      if ( evt.target.isSelected ) return;

      //   Fill color
      var fillColor = chroma(evt.target.styles.normal.fillColor)._rgb;
      var fillColorHover = chroma(evt.target.styles.hover.fillColor)._rgb;

      //   Stroke color
      var strokeColor = chroma(evt.target.styles.normal.strokeColor)._rgb;
      var strokeColorHover = chroma(evt.target.styles.hover.strokeColor)._rgb;
      
      //   Stroke weight
      var strokeWeight = evt.target.styles.normal.lineWidth;
      var strokeWeightHover = evt.target.styles.hover.lineWidth; 

      // Get the parent group
      var tmp_group = shape.getParentGroup();
      tmp_group.setZIndex(0);

      //  Get all the shapes on this group
      var tmp_objects = tmp_group.getObjects();

      // If not, animate
      var animProps = { 
        r: fillColorHover[0], g:fillColorHover[1], b:fillColorHover[2], a:fillColorHover[3], 
        sr:strokeColorHover[0], sg:strokeColorHover[1],sb:strokeColorHover[2],sa:strokeColorHover[3],
        lineWidth:strokeWeightHover
      };

      $( animProps ).animate({ 
        r:fillColor[0], g:fillColor[1], b:fillColor[2], a:fillColor[3], 
        sr:strokeColor[0], sg:strokeColor[1],sb:strokeColor[2],sa:strokeColor[3],
        lineWidth:strokeWeight
      }, { 

        duration: duration,
        easing: easing,

        step: function (now, fx) {

          // get the color of the selected shape
          var nsc = evt.target.styles.normal;

          nsc.fillColor = 'rgba(' + Math.round(animProps.r) + ',' + Math.round(animProps.g) + ',' + Math.round(animProps.b) + ',' + animProps.a + ')';
          nsc.strokeColor = 'rgba(' + Math.round(animProps.sr) + ',' + Math.round(animProps.sg) + ',' + Math.round(animProps.sb) + ',' + animProps.sa + ')';
          nsc.lineWidth = animProps.lineWidth;
          nsc.lineJoin = 'round';

          // Assign the color to all the objects
          for (var x = 0; x < tmp_objects.length; x++) 
            if (!tmp_objects[x].isSelected)
              tmp_objects[x].setStyle( nsc );
        }
      });
    };

    var mouseClick = function ( evt ) {

      //   Fill color
      var fillColorHover = chroma(evt.target.styles.hover.fillColor)._rgb;
      var fillColorSelected = chroma(evt.target.styles.selected.fillColor)._rgb;

      //   Stroke color
      var strokeColorHover = chroma(evt.target.styles.hover.strokeColor).alpha(1)._rgb;
      var strokeColorSelected = chroma(evt.target.styles.selected.strokeColor).alpha(1)._rgb;
      
      //   Stroke weight
      var strokeWeightHover = evt.target.styles.hover.lineWidth; 
      var strokeWeightSelected = evt.target.styles.selected.lineWidth; 

      // Get the parent group
      var tmp_group = evt.target.getParentGroup();

      tmp_group.setZIndex(1000);


      // Color all the objects first to normal
      // for (var i = 0; i < this.shapes.length; i++) {
        var tmp_objects = this.shape.getObjects();
        for (var x = 0; x < tmp_objects.length; x++) {
          tmp_objects[x].isSelected = false; // set 
          tmp_objects[x].setStyle( tmp_objects[x].styles.normal );
        }
      // };

      //  Get all the shapes on this group
      var tmp_group_objects = tmp_group.getObjects();
      for (var x = 0; x < tmp_group_objects.length; x++) 
        tmp_group_objects[x].isSelected = !tmp_group_objects[x].isSelected;
      

      // If not, animate
      var animProps = { 
        r: fillColorHover[0], g:fillColorHover[1], b:fillColorHover[2], a:fillColorHover[3], 
        sr:strokeColorHover[0], sg:strokeColorHover[1],sb:strokeColorHover[2],sa:strokeColorHover[3],
        lineWidth:strokeWeightHover
      };

      $( animProps ).animate({ 
        r:fillColorSelected[0], g:fillColorSelected[1], b:fillColorSelected[2], a:fillColorSelected[3], 
        sr:strokeColorSelected[0], sg:strokeColorSelected[1],sb:strokeColorSelected[2],sa:strokeColorSelected[3],
        lineWidth:strokeWeightSelected
      }, { 

        duration: duration,
        easing: easing,

        step: function (now, fx) {

          // get the color of the selected shape
          var nsc = evt.target.styles.selected;

          nsc.fillColor = 'rgba(' + Math.round(animProps.r) + ',' + Math.round(animProps.g) + ',' + Math.round(animProps.b) + ',' + animProps.a + ')';
          nsc.strokeColor = 'rgba(' + Math.round(animProps.sr) + ',' + Math.round(animProps.sg) + ',' + Math.round(animProps.sb) + ',' + animProps.sa + ')';
          nsc.lineWidth = animProps.lineWidth;
          nsc.lineJoin = 'round';

          for (var x = 0; x < tmp_group_objects.length; x++) {
            tmp_group_objects[x].setStyle( nsc );
          }
        }
      });


    };

    var tmp_group = new H.map.Group();
    var strips = this.parsePolyStrings( jsonShape );

    for (var x = 0; x < strips.length; x++) {

      var strip = strips[x];    
      
      var shape = new H.map.Polygon( strip.strip );
      
      // Adding custom properties
      shape.metadata = this.info;
      shape.isSelected = false;
      shape.styles = styles;
      shape.setStyle( styles.normal );

      if ( styles.hover ) {
        shape.addEventListener('pointerenter', mouseEnterStyle );
        shape.addEventListener('pointerleave', mouseOutStyle );
      }
      if (styles.selected) 
        shape.addEventListener('tap', mouseClick );

      // Draw the polygons
      tmp_group.addObject(shape);
      this.shape = tmp_group;
      
    }

    return tmp_group;
  },

  isPolyHole: function(allWkt, polyWkt) {
    var previousChar = allWkt[allWkt.indexOf(polyWkt) - 1];
    return previousChar === "," || previousChar === " ";
  },


  parsePolyStrings: function( ps ) {

    var i, j, lat, lng, tmp, strip, strips = [],
    // Match '(' and ')' plus contents between them which 
    // contain anything other than '(' or ')'.
    m = ps.match(/\([^\(\)]+\)/g);
    if (m !== null) {
      for (i = 0; i < m.length; i++) {
        //match all numeric strings
        tmp = m[i].match(/-?\d+\.?\d*/g);
        if (tmp !== null) {
          // Convert all the coordinate sets in tmp from strings to Numbers
          // And add them to the current strip.
          for (j = 0, strip = new H.geo.Strip(); j < tmp.length; j += 2) {
            lng = Number(tmp[j]);
            lat = Number(tmp[j + 1]);
            strip.pushLatLngAlt(lat, lng, 0);
          }
          strips.push({
            strip: strip,
            isHole: this.isPolyHole(ps, m[i])
          });
        }
      }
    }
    // Returns array of strips or empty array.
    return strips;
  },


  // Still need to refactor and librarize this function
  initAntennasEvenSpaced: function ( context, location, styles ) {

    context.lineCap = "round";

    var coords = map.geoToScreen( new H.geo.Point( location.latitude, location.longitude ));
    coords.x *= AppCore.ppi;
    coords.y *= AppCore.ppi;

    // Circle
    var color = styles.fillColor;
    var strokeColor = styles.strokeColor;
    var arrowLenght = syles.lenght;
    
    arrowLenght *= AppCore.ppi; // check if is retina

    // Stroke 
    context.beginPath();
    context.strokeStyle = strokeColor;
    context.lineWidth = 5 * AppCore.ppi;
    lineAtAngle(coords.x, coords.y, arrowLenght, rows[i][2], 8 );
    context.stroke();

    // Drawing stroke of the arrow head
    context.beginPath();
    context.fillStyle = color;
    context.strokeStyle = "#343e4e";
    context.lineWidth = 4 * AppCore.ppi;
    drawArrowhead(coords.x + arrowLenght * Math.cos(rows[i][2]) , coords.y + arrowLenght * Math.sin(rows[i][2]) , rows[i][2] + Math.radians(90)  );

    // drawing the colored line
    context.beginPath();
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 3 * AppCore.ppi;
    lineAtAngle(coords.x , coords.y , arrowLenght, rows[i][2], 8 * AppCore.ppi  );
    context.stroke();
    
    // Drawing the colored arrow head
    context.beginPath();
    context.fillStyle = color;
    context.lineWidth = 2 * AppCore.ppi;
    drawArrowhead(coords.x + arrowLenght * Math.cos(rows[i][2]) , coords.y + arrowLenght * Math.sin(rows[i][2]) , rows[i][2] + Math.radians(90)  );
    
    // Drawing the circle
    context.beginPath();
    context.fillStyle = "#dde5e9";
    context.strokeStyle = strokeColor;
    context.lineWidth = 1 * AppCore.ppi;
    context.arc(coords.x, coords.y, circle * AppCore.ppi, 0, 2 * Math.PI );
    context.fill();
    context.stroke();
  
  }
}


