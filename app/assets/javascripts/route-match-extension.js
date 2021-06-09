(function () {
    'use strict';


    if (H.service.Platform.prototype.ext === undefined) {
        H.service.Platform.prototype.ext = {};
    }

    H.service.Platform.prototype.ext.getRouteMatchService = function () {
        return new RmeGateway('https://rme.api.here.com/2');
    };

    function RmeGateway(endpoint) {
        this.endpoint = endpoint;
    }

    RmeGateway.prototype.matchRoute = function (mode, traceFileContent, callback) {
        var url = this.endpoint + '/matchroute.json?routemode=' + mode + '&file=' + encodeURIComponent(traceFileContent) + '&app_id=' + app_id + '&app_code=' + app_code;
        var that = this;

        loadJSONP(url, function (resp) {
            if (resp.error || resp.faultCode || resp.type) {
                callback.call(that, resp, new Error(resp.error));
                return;
            }
            callback.call(that, resp, null);
        }, this);
    };

})();


var loadJSONP = (function () {
    'use strict';
    var unique = 0;
    return function (url, callback, context) {
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

