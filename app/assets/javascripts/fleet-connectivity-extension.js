(function() {
    'use strict';

    if (H.service.Platform.prototype.ext === undefined) {
        H.service.Platform.prototype.ext = {};
    }

    H.service.Platform.prototype.ext.getFleetConnectivityService = function() {
        return new FceGateway('https://fce.api.here.com/1');
    };

    function FceGateway(endpoint) {
        this.endpoint = endpoint;
    }

    FceGateway.prototype.assetUpdate = function(event, options, callback) {
        var url = this.endpoint + '/assetupdate.json?event=' + encodeURIComponent(JSON.stringify(event)) + '&app_code=' + app_code + '&app_id=' + app_id;

        if (options && options.incremental === true) {
            if (!this.last_update_timestamp_ms) {
                this.last_update_timestamp_ms = options.last_update_timestamp_ms || new Date().getTime();
            }
            url += '&last_update_timestamp_ms=' + this.last_update_timestamp_ms;
            this.last_update_timestamp_ms = new Date().getTime() + 1;
        }

        var that = this;

        loadJSONP(url, function(resp) {
            if (resp.error_id != null) {
                callback.call(that, resp, new Error(resp.issues));
                return;
            }
            callback.call(that, resp, null);
        }, this);
    };



    FceGateway.prototype.sendJob = function(job, callback) {
        var url = this.endpoint + '/sendjob.json?app_id=' + app_id + '&app_code=' + app_code + '&job=' + encodeURIComponent(JSON.stringify(job));
        var that = this;
        loadJSONP(url, function(resp) {
            if (resp.error_id != null) {
                callback.call(that, resp, new Error(resp.issues));
                return;
            }
            callback.call(that, job, null);
        }, this);
    };

    FceGateway.prototype.listUpdates = function(assetIds, dispatcherId, options, callback) {
        var escapedAssetIds = [];
        for (var i = 0; i < assetIds.length; i++) {
            if (assetIds[i].indexOf('"') > 0) {
                escapedAssetIds.push('"' + assetIds[i].replace(/\"/g, '\\"') + '"');
            } else {
                escapedAssetIds.push(assetIds[i]);
            }
        }

        var url = this.endpoint + '/listupdates.json?app_id=' + app_id + '&app_code=' + app_code + '&asset_ids=' + escapedAssetIds.join(',') + '&dispatcher_id=' + dispatcherId;
        if (options && options.incremental === true) {
            if (!this.last_update_timestamp_ms) {
                this.last_update_timestamp_ms = new Date().getTime();
            }
            url += '&last_update_timestamp_ms=' + this.last_update_timestamp_ms;
            this.last_update_timestamp_ms = new Date().getTime() + 1;
        } else if (options.last_update_timestamp_ms && options.last_update_timestamp_ms > 0) {
            this.last_update_timestamp_ms = options.last_update_timestamp_ms;
            url += '&last_update_timestamp_ms=' + this.last_update_timestamp_ms;
        }
        var that = this;
        loadJSONP(url, function(resp) {
            if (resp.error_id != null) {
                callback.call(that, resp, new Error(resp.issues));
                return;
            }
            callback.call(that, resp, null);
        }, this);
    };

    // Thanks: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    FceGateway.prototype.createId = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }


    FceGateway.prototype.createAssetId = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return 'AX' + '-' + s4() + '-' + s4();
    }


    FceGateway.prototype.createDispatcherId = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return 'DX' + '-' + s4() + '-' + s4();
    }

    FceGateway.prototype.createJobId = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return 'JX' + '-' + s4() + '-' + s4();
    }
})();

var loadJSONP = (function() {
    'use strict';
    var unique = 0;
    return function(url, callback, context) {
        // INIT
        var jsonpCallbackParamName = 'callback';
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
        window[name] = function(data) {
            callback.call((context || window), data);
            document.getElementsByTagName('head')[0].removeChild(script);
            script = null;
            delete window[name];
        };

        // Load JSON
        document.getElementsByTagName('head')[0].appendChild(script);
    };
})();