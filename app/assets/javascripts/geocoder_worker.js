/*
	author domschuette
	(C) HERE 2016
*/
String.prototype.replaceAll = function(search, replace)
{
	if (replace === undefined) {
		return this.toString();
	}
	return this.replace(new RegExp('[' + search + ']', 'g'), replace);
};

self.addEventListener('message', function(e)
{
	if(!e.data.apikey && e.data.mailTo)
	{
		appId = e.data.appId;
		appCode = e.data.appCode;
		mailTo = e.data.mailTo;
		threshold = e.data.threshold;
		apikey="";
	}
	else if(e.data.apikey && e.data.mailTo){
		apikey = e.data.apikey;
		mailTo = e.data.mailTo;
		threshold = e.data.threshold;
	}
	else
	{
		var addresses = e.data;
		
		// remove empty line if exists
		if(addresses[addresses.length - 1] == "")
			addresses.splice(-1,1);
		
		var resp = new Object();
		resp.msg = addresses.length + " addresses received, Processing records " + (addresses.length > threshold ? "in batch mode" : "directly");
		resp.count = addresses.length;
				
		self.postMessage(resp);
		
		if(addresses.length > threshold)
		{
			addresses = cleanInput(addresses);
			startBatchGeocoding(addresses);
		}
		else
		{
			geocodeOneByOne(addresses);
		}
	}
}, false);

function cleanInput(addresses)
{
	for(var i = 0; i < addresses.length; i++)
	{
		addresses[i] = addresses[i].replaceAll(";", "%20").replaceAll("\"", "").trim();
	}
	return addresses;
}

function startBatchGeocoding(addresses)
{
	var data = "";
	var test = addresses[0],
		pattern = /\d+,\d+,\d+/i
		rgc = pattern.test(test);
    
	if(rgc===true){
		data = "recId|prox\n"
	}
	else{
		data = "recId|searchText\n";
	}
	
	// debugger;
	
	for(var i = 1; i < addresses.length; i++)
	{
		data +=  i + "|" + addresses[i] + "\n";
	}

	if (apikey === ""){
	    var url = ["https://batch.geocoder.api.here.com/6.2/jobs.json",
			   "?action=run",
			   "&mailto=",
			   mailTo,
			   "&gen=8",
			   "&header=true",
			   "&indelim=%7C",
			   "&outdelim=%7C",
			   "&outcols=displayLatitude,displayLongitude,locationLabel,houseNumber,street,district,city,postalCode,county,state,country",
			   "&outputCombined=true",
			   "&maxresults=1",
			   rgc ? "&mode=retrieveAddresses" : "",
			   "&app_code=",
			   appCode,
			   "&app_id=",
			   appId].join("");
	}else{
		var url = ["https://batch.geocoder.ls.hereapi.com/6.2/jobs.json", 
			"?action=run",
			"&mailto=",
			mailTo,
			"&gen=8",
			"&header=true",
			"&indelim=%7C",
			"&outdelim=%7C",
			"&outcols=displayLatitude,displayLongitude,locationLabel,houseNumber,street,district,city,postalCode,county,state,country",
			"&outputCombined=true",
			"&maxresults=1",
			rgc ? "&mode=retrieveAddresses" : "",
			"&apiKey=",
			apikey].join("");
	}

	var xhr = getXHR();
	xhr.open('POST', url, true);
	xhr.onload = function () {
		var json = this.responseText,
			obj = JSON.parse(json);
		
		setBatchRequestId(obj.Response.MetaInfo.RequestId);
	};
	xhr.send(data);
}

function setBatchRequestId(rId)
{
	requestId = rId;
	checkBatchStatus();
}

function checkBatchStatus()
{
	if (apikey === ""){
	    var url = ["https://batch.geocoder.api.here.com/6.2/jobs/",
			   requestId,
			   "?action=status",
			   "&app_id=", 
			   appId,
			   "&app_code=", 
			   appCode].join("");
	}else{
		var url = ["https://batch.geocoder.ls.hereapi.com/6.2/jobs.json",
			   requestId,
			   "?action=status",
			   "&apiKey=",
			   apikey].join("");
	}
	
	var xhr = getXHR();
	xhr.open('GET', url, true);
	xhr.onload = function () {
		var status = this.responseText.substring(xhr.responseText.indexOf("<Status>") + 8, xhr.responseText.indexOf("</Status>"));
		if(status == "completed")
		{
			if (apikey === ""){
			    var url = ["https://batch.geocoder.api.here.com/6.2/jobs/",
					   requestId, 
					   "/result",
					   "?app_code=",
					   appCode,
					   "&app_id=",
					   appId].join("");
			}else{
				var url = ["https://batch.geocoder.ls.hereapi.com/6.2/jobs.json",
					   requestId, 
					   "/result",
					   "?apiKey=",
					   apikey].join("");
			}
			
			var resp = new Object();
			resp.status = status;
			resp.zipURL = url;
			
			self.postMessage(resp);
		}
		else if(status == "failed" || status == "canceled")
		{
			var resp = new Object();
			resp.status = status;
			resp.zipURL = null;
			
			self.postMessage(resp);
		}
		else
		{
			var resp = new Object();
			resp.status = status;
			resp.zipURL = null;
			
			self.postMessage(resp);
			
			setTimeout(checkBatchStatus, 1000);
		}
	};
	xhr.send("");
}

function geocodeOneByOne(addresses, app_id, app_code, mailTo)
{
	for(var i = 0; i < addresses.length; i++)
	{
		if (apikey === ""){
		    var url = ["https://geocoder.api.here.com/6.2/search.json?",
				"app_id=",
				appId,
				"&app_code=",
				appCode,
				"&searchText=",
				addresses[i].replace(";", "%20").replace("\"", "").trim(),
				].join("");
		}else{
			var url = ["https://geocoder.ls.hereapi.com/6.2/search.json?",
				"apiKey=",
				apikey,
				"&searchText=",
				addresses[i].replace(";", "%20").replace("\"", "").trim(),
				].join("");
		}
		fetch(url, function(xhr) {	
			var result = xhr.responseText;
			
			var object = JSON.parse(result);
			setTimeout(function() { sendback(); }, 100);
			function sendback(){
				self.postMessage(object);
			}
		});
	}
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