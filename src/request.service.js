(function () {
    angular.module('luooApp')
        .service('RequestService', RequestService);

    RequestService.$inject = ['$q'];

    function RequestService($q) {

    }

    RequestService.prototype.get = function (url) {
        sentRequest({url: url});
    };

    function sentRequest(data) {
        deferred = $q.deferr()

        var request = new XMLHttpRequest();
        request.open(data.method, data.url);
        if (data.responseType) {
            request.responseType = data.responseType;
        }
        request.onload = onSuccess;
        request.send(null);

        return request;

        function onSuccess() {
            var response = request.response
        }
    }

})();
