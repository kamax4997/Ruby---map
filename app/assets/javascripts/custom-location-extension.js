(function () {
    'use strict';

    if (H.service.Platform.prototype.ext === undefined) {
        H.service.Platform.prototype.ext = {};
    }

    H.service.Platform.prototype.ext.getCustomLocationService = function () {
        return new CleGateway('https://customlocation.cit.here.com');
    };

    function CleGateway(endpoint) {
        this.endpoint = endpoint;
    }

    CleGateway.prototype.login = function (username, password, callback) {
        this.username = username;
        this.password = password;

        var url = this.endpoint + '/admin/user/login?username=' + username + '&password=' + password;

        var that = this;

        loadJSONP(url, function (data) {
            if (data.token) {
                that.token = data.token;
                callback.call(this, data, null);
            } else {
                callback.call(this, null, new Error(data.status));
            }
        }, this);
    };

    CleGateway.prototype.uploadWktSync = function (customerId, layerId, wkt, callback) {
        var url = this.endpoint + '/file/import/async/shape?username=' + this.username + '&password=' + this.password + '&customerId=' + customerId + '&layerId=' + layerId + '&wkt=' + encodeURI(wkt);
        var that = this;
        loadJSONP(url, function (data) {
            var result = new DOMParser().parseFromString(data, 'text/xml');
            var status = result.getElementsByTagName('Status')[0].childNodes[0].nodeValue;
            if (status === 'OK') {
                var importId = result.getElementsByTagName('ImportId')[0].childNodes[0].nodeValue;
                var reportURL = result.getElementsByTagName('ReportURL')[0].childNodes[0].nodeValue;
                var token = reportURL.match(/token=([0-9a-z]+)/g)[0].replace('token=', '');

                // Because cle change token globally after import.
                that.token = token;

                var url = this.endpoint + '/file/import/async/report.xml?token=' + token + '&importId=' + importId + '&customerId=' + customerId;

                var timer = window.setInterval(function () {
                    loadJSONP(url, function (data) {
                        var result = new DOMParser().parseFromString(data, 'text/xml');
                        var status = result.getElementsByTagName('Status')[0].childNodes[0].nodeValue;

                        if (status === 'STARTED') {
                            // will check again
                            return;
                        } else if (status === 'DONE') {
                            window.clearInterval(timer);
                            callback.call(this, data, null);
                        } else {
                            window.clearInterval(timer);
                            callback.call(this, null, new Error(data));
                        }
                    });
                }, 500);
            } else {
                callback.call(this, null, new Error(data));
            }
        }, this);
    };

    CleGateway.prototype.getCustomers = function (callback) {
        var url = this.endpoint + '/admin/customer/search?token=' + this.token;

        loadJSONP(url, function (data) {
            if (data.customers) {
                callback.call(this, data.customers, null);
            } else {
                callback.call(this, null, new Error(data.status));
            }
        }, this);
    };

    CleGateway.prototype.getFeatures = function (customerId, layerId, callback) {
        var url = this.endpoint + '/admin/feature/list?token=' + this.token + '&customerId=' + customerId + '&layerId=' + layerId;

        loadJSONP(url, function (data) {
            if (data.status === 'OK') {
                callback.call(this, data.features, null);
            } else {
                callback.call(this, null, new Error(data.status));
            }
        }, this);
    };

})();


var loadJSONP = (function () {
    'use strict';
    var unique = 0;
    return function (url, callback, context) {
        // INIT
        var jsonpCallbackParamName = 'jsonpCallback';
        var name = "_jsonp_" + unique++;
        if (url.match(/\?/)) {
            url += '&' + jsonpCallbackParamName + '=' + name;
        } else {
            url += '?' + jsonpCallbackParamName + '=' + name;
        }

        // Create script
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Setup handler
        window[name] = function (data) {
            callback.call((context || window), data);
            document.getElementsByTagName('head')[0].removeChild(script);
            script = null;
            delete window[name];
        };

        // Load JSON
        document.getElementsByTagName('head')[0].appendChild(script);
    };
})();
