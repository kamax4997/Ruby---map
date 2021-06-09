/*
	author domschuette
	(C) HERE 2019
*/

self.addEventListener('message', function(e)
{
	if(e.data.coord && e.data.traveltime && e.data.app_id && e.data.app_code && e.data.departure && e.data.index != undefined)
	{
		getIsoline(e.data.coord, e.data.traveltime, e.data.app_id, e.data.app_code, e.data.departure, e.data.index);
	}
}, false);


function getIsoline(coord, traveltime, app_id, app_code, departure, index)
{
	var url = [
		"https://fleet.api.here.com/2/calculateisoline.json?",
		"mode=",
		"fastest;",
		"emergency;",
		"traffic:",
		"enabled",
		"&start=",
		coord.lat,
		",",
		coord.lng,
		"&rangeType=time",
		"&range=",
		traveltime,
		"&app_id=",
		app_id,
		"&app_code=",
		app_code,
		"&departure=",
		departure,
		"&requestId=",
		index
		// ,"&isolineAttributes=shape;links",
	].join("");
	
	fetch(url, function(xhr) {
		var result = xhr.responseText;
		
		var object = JSON.parse(result);
		setTimeout(function() { sendback(); }, 100);
		function sendback(){
			self.postMessage(object);
		}
	});
}

function fetch(url, callback) {
	var xhr = getXHR();

	xhr.onreadystatechange = ensureReadiness;
	
	function ensureReadiness() {
		if(xhr.readyState < 4) {
			return;
		}
		
		if(xhr.status !== 200) {
			return;
		}

		if(xhr.readyState === 4) {
			callback(xhr);
		}
	}
	
	xhr.open('GET', url, true);
	xhr.send('');
}

function getXHR()
{
	var xhr;

	if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
	else {
		var versions = ["MSXML2.XmlHttp.5.0", 
						"MSXML2.XmlHttp.4.0",
						"MSXML2.XmlHttp.3.0", 
						"MSXML2.XmlHttp.2.0",
						"Microsoft.XmlHttp"]

		 for(var i = 0, len = versions.length; i < len; i++) {
			try {
				xhr = new ActiveXObject(versions[i]);
				break;
			}
			catch(e){}
		 }
	}
	return xhr;
}