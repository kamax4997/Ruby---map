var https = require('https');
var HTMLParser = require('node-html-parser');

https.get('https://www.mcc-mnc.com/', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    var root = HTMLParser.parse(data);

    var mncmccTable = root.querySelector('#mncmccTable');

    var values = mncmccTable.structuredText.split('\n');
  
    var mccmncMap = new Map();
    var mcc,mnc,country,provider;
    for(var i = 1 ; i < values.length; i+=6) {
      mcc = values[i];
      mnc = values[i+1];

      if(mnc == 'n/a') continue;

      if(mnc.length == 2){
        mnc = '0'+ mnc;
      }
      else if(mnc.length == 1){
        mnc = '00'+ mnc;  
      }
      country = values[i+3]
      provider;
      if(isNaN(values[i+5]))
        provider = values[i+5]
      else {
        provider = 'Unknown';
        i-=1;
      }
      var mncObj = {};
      mncObj.mnc = mnc;
      mncObj.name = provider;
      
      if(mccmncMap.get(mcc) !== undefined) {
        mccmncMap.get(mcc).push(mncObj);
      }
      else {
        var carrier = [];
        carrier.push(country);
        carrier.push(mncObj);
        mccmncMap.set(mcc,carrier)
      }
    }
    console.log(JSON.stringify(Array.from(mccmncMap.entries())));
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});