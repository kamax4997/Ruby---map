/**
 * This is a simple drop box that accepts Trace file and load it into RME 
 * to get Trace Points
 */


TraceFileBox = function (id, rmeUrl, callbackFunction) {
	
	this.element = document.getElementById(id);
	this.url = rmeUrl;
	this.tracePoints = [];
	this.waypointsText = "";
	this.callbackFunction = callbackFunction;
	this.id = id;
	var scope = this;

//adding the event to input trace file text area
this.element.addEventListener(
	'dragover', function handleDragOver(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy';
	},
	false
);

this.element.addEventListener(
    'drop', function(evt) {
	    evt.stopPropagation();
	    evt.preventDefault();
	    var files = evt.dataTransfer.files;
	    var file = files[0];
	    var r = new FileReader();
	    r.onload = function(e) { 
	    	scope.element.value = r.result;
	    	uploadTrace(scope);
	    }
	    r.readAsText(file);
    },
    false
);

 return this;
}

//return matched trace point from the trace file
TraceFileBox.prototype.getTracePoints = function() {
    return this.tracePoints;
}

//--- return string for populating waypoints field
TraceFileBox.prototype.getWaypointsString = function() {
    return this.waypointsText;
}

//--- return string for populating waypoints field
TraceFileBox.prototype.setValue = function(val) {
	this.element.value = val;
	uploadTrace(this);
}

//--- set Url link
TraceFileBox.prototype.setUrl = function(val) {
	this.url = val;
}
  //--- function for uploading trace file to the RME
  var uploadTrace = function(scope) {
    
	if (!scope.element.value){ //if there is no trace file then do not call RME.
        return;
    }
    var urlRME = scope.url;
    var finalUrl = checkAndAddAppIdAndCode(urlRME, 'RME Request');
    if (finalUrl) makeAjaxCall (finalUrl, scope.element.value, scope);
}

  //--- function populates array of matched tracepoints and also creates string to use the same tracepoints as waypoints for calculateroute
   var populateWaypointFromTraceFile = function(data, scope){
	
	 var tracepoints = data.response.route[0].waypoint;
	 scope.tracePoints = [];
	//adds all trace point to the waypoints string and trace points array
	for (var i = 0; i< tracepoints.length; i++){
		var currWaypoint = tracepoints[i];
		var tracePoint = {};
		tracePoint.lat = currWaypoint.mappedPosition.latitude;
		tracePoint.lon = currWaypoint.mappedPosition.longitude;
		tracePoint.timestamp = currWaypoint.timestamp;
		scope.tracePoints[i] = tracePoint;
		if (i == 0)
		scope.waypointsText += i + ",\t" + (Math.round(tracePoint.lat * 100000.0) / 100000.0) + ",\t" + (Math.round(tracePoint.lon * 100000.0) / 100000.0);
		else 
		scope.waypointsText += "\n" + i + ",\t" + (Math.round(tracePoint.lat * 100000.0) / 100000.0) + ",\t" + (Math.round(tracePoint.lon * 100000.0) / 100000.0);
	}
};


//--- if user put app_id/app_code into the request, we use it. Otherwise we use the TCS default app_id.
	function checkAndAddAppIdAndCode(url, requestFieldName){
          var appIdRegEx= /[\?&]app_id=/i;
          var appCodeRegEx= /[\?&]app_code=/i;
          if( url.search( appIdRegEx ) === -1 && url.search( appCodeRegEx ) === -1 ) {
              if( ! url.endsWith( "&" ) ) url= url.concat( "&" );
              url= url.concat( "app_id=" + app_id_cors + "&app_code=" + app_code_cors );                
          }
          if( ( url.search( appIdRegEx ) >= 0 && url.search( appCodeRegEx ) < 0 ) || ( url.search( appIdRegEx ) < 0 && url.search( appCodeRegEx ) >= 0 ) ) {
              alert('If you provide credentials in the '+ requestFieldName +' field, please provide both app_id AND app_code.');                
              return;
          }
          return url;
      }

//--- function to make an ajax call to the backend server
	function makeAjaxCall(url, content, scope){
    $.ajax({ 
    	url: url, 
    	dataType: "json", 
    	async: true, 
    	type: 'post',
    	data:content,
		contentType: 'application/octet-stream',
        success: function(data) {
        	//after receiving the response trace points are parsed and then callback function is called
            populateWaypointFromTraceFile(data, scope);
            scope.callbackFunction(data);
        },
        error: function(xhr, status, e) {
        	  alert((xhr.responseJSON.issues[0].message ? xhr.responseJSON.issues[0].message :  xhr.responseJSON.issues[0] ) || xhr.responseJSON);
        }
    });
}


