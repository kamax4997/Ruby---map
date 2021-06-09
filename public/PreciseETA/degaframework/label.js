var Label = function ( title, coords, priority, props ) {

  if ( props == undefined ) props = {};

  this.hidpi = ( "devicePixelRatio" in window && devicePixelRatio > 1);
  this.ppi = this.hidpi ? 2 : 1;
  this.title = title;
  this.position = coords;
  this.priority = priority? priority : 0;
  this.isVisible = props.visible? props.visible : true;
  this.widthOffset = props.widthOffset? props.widthOffset : this.ppi;
  this.textAlignment = props.textAlignment? props.textAlignment : "center";
  this.showAnchor = props.showAnchor? props.showAnchor : false;
  this.anchor = null;
  this.anchorColor = props.anchorColor? props.anchorColor : "red";
  this.anchorStrokeColor = props.anchorStrokeColor? props.anchorStrokeColor : this.anchorColor;
  this.anchorStrokeWidth = (props.anchorStrokeWidth? props.anchorStrokeWidth : 0) * this.ppi;
  this.anchorSize = (props.anchorSize? props.anchorSize : 4) * this.ppi;

  this.blurAmount = props.shadowBlurAmount? props.shadowBlurAmount : "3";
  this.shadowColor = props.shadowColor? props.shadowColor : 'black';
   
  // This are the fonts available, pick one of then ****** since does not pick the fonts defined on stylessheets
  var serif_fonts = ["Georgia", "Palatino Linotype", "Book Antiqua", "Palatino", "Times New Roman", "Times", "serif" ];
  var sand_serif_fonts = ["Arial", "Helvetica", "Arial Black", "Comic Sans MS", "cursive", "Impact", "Lucida Sans Unicode", "Lucida Grande", "Tahoma", "Geneva", "Trebuchet MS", "Verdana", "sans-serif" ];
  var monospace_fonts = ["Courier New", "Courier", "Lucida Console", "Monaco", "monospace" ];
  
  // Fonts style
  this.fontPadding = (( props.padding? props.padding : 6 ) * this.ppi) + this.anchorSize;
  this.fontFamily = props.fontFamily? props.fontFamily : sand_serif_fonts[1];
  this.fontSize = (props.fontSize? props.fontSize : 12) * this.ppi;
  this.width = (this.title.width ( this.fontFamily + " " + this.fontSize + "px") * this.ppi ) + this.fontPadding + this.widthOffset;
  this.height = this.fontSize + this.fontPadding;

  // Center-center
  this.labelsPosition = { x:this.width * 0.5, y: this.height - this.fontPadding / 1.3 };
  this.fontWeight = props.fontWeight? props.fontWeight : "regular";
  this.fontStyle = props.fontStyle? props.fontStyle : "normal";

  // Colors & strokes
  this.color = props.color? props.color : "#6d6e71";
  this.strokeColor = props.strokeColor? props.strokeColor : "rgba(255,255,255,0.75)";
  this.strokeWidth = ( props.strokeWidth? props.strokeWidth : 2 ) * this.ppi;
  this.opacity = props.opacity? props.opacity : 1;
  this.bgColor = props.bgColor? props.bgColor : "transparent";
  
  this.enableShadow = props.enableShadow? '<defs><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="' + this.blurAmount + ' ' + this.blurAmount + '" result="shadow"/><feOffset dx="0" dy="0"/></filter></defs>' : '';
  this.svgShadowed = props.enableShadow? '<text class="label" font-size="' + this.fontSize + '" x="' + this.labelsPosition.x + '" y="' + this.labelsPosition.y + '" text-anchor="middle" fill="' + this.color + '" style="font-family:'+ this.fontFamily + ';font-style:'+ this.fontStyle + ';font-weight:' + this.fontWeight + '; text-rendering: geometricPrecision; filter: url(#shadow); fill: ' + this.shadowColor + ';" >' + this.title + '</text>' : '';
  this.anchorShape = this.showAnchor? '<rect x="0" y="' + ((this.height - this.anchorSize) * 0.5) +'" height="'+ this.anchorSize +'" width="' + this.anchorSize + '" style="fill:' + this.anchorColor + '; stroke: ' + this.anchorStrokeColor +'; stroke-width:' + this.anchorStrokeWidth + '; "/>' : '';
  this.visibility = this.isVisible;
  this.priority = 1;

  if ( this.textAlignment == "left") this.anchor = { x: 0, y:this.height * 0.5 };
  else if( this.textAlignment == "right") this.anchor = { x: this.width, y:this.height * 0.5 };
  else this.anchor = { x: this.width * 0.5, y:this.height * 0.5 }; // center

  this.getMarker = function () {
    this.marker = new H.map.Marker( this.position,{ icon: this.getIcon() }); 
    this.marker.setVisibility(this.visibility);
    this.marker.priority = this.priority;
    return this.marker;
  }

  this.getIcon = function () {

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="'+ this.width +'px" height="' + this.height + 'px">' +
              '<g style="opacity:'+ this.opacity +'">' +
                this.enableShadow +
                '<rect x="0" y="0" height="'+ this.height +'" width="' + this.width + '" style="fill:' + this.bgColor + ' "/>' +
                this.anchorShape +
                this.svgShadowed +
                '<text class="label" font-size="' + this.fontSize + '" x="' + this.labelsPosition.x + '" y="' + this.labelsPosition.y + '" text-anchor="middle" fill="' + this.strokeColor + '" style="stroke: ' + this.strokeColor +'; stroke-width:' + this.strokeWidth + ';font-family:'+ this.fontFamily + ';font-style:'+ this.fontStyle + ';font-weight:' + this.fontWeight + '; text-rendering: geometricPrecision; " >' + this.title + '</text>' +
                '<text class="label" font-size="' + this.fontSize + '" x="' + this.labelsPosition.x + '" y="' + this.labelsPosition.y + '" text-anchor="middle" fill="' + this.color + '" style="font-family:'+ this.fontFamily + ';font-style:'+ this.fontStyle + ';font-weight:' + this.fontWeight + '; text-rendering: geometricPrecision; " >' + this.title + '</text>' +
              '</g>' +
            '</svg>';

    this.icon = new H.map.Icon(svg, { hitArea: new H.map.HitArea(H.map.HitArea.ShapeType.NONE), anchor:this.anchor, asCanvas:true });

    return this.icon;
  }

  this.setPriority = function ( priority ) {
    this.priority = priority;
  }

  this.getPriority = function ( priority ) {
    return this.priority;
  }

  this.setVisibility = function ( visibility ) {
    this.visibility = visibility;
  }

  this.setOpacity = function ( opacity ) {
    this.opacity = opacity;
  }
  
};

// *********
// Implement this somewhere, Maybe in AppCore, so we can used everywhere
String.prototype.width = function(font) {

  var f = font || '24px arial',
      o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      w = o.width();

  o.remove();

  return w;
}