(function () {
    var $ = require('cheerio');

    angular.module('luooApp')
        .service('downloadService', downloadService);

    downloadService.$inject = ['$http', '$q', 'configFactory'];

    function downloadService($http, $q, configFactory) {
        this.downloadSong = downloadSong;

        function downloadSong(single) {
            getDownloadURL(single).then(onSuccess);

            function onSuccess(downloadURL) {
                console.log(downloadURL);
                chrome.downloads.download({filename: single.name + ".mp3", url: downloadURL}, downloadCallback);
            }
        }

        function downloadCallback(downloadId) {
            console.log(downloadId);
        }

        function getDownloadURL(single) {
            var deferred = $q.defer();
            var singleMetadataPromise = getMetadata(single);
            var albumPagePromise = $http.get(single.url);

            $q.all([singleMetadataPromise, albumPagePromise]).then(function (values) {
                console.log(values);
                var singleMetadata = values[0];
                var albumPageResponse = values[1].data;
                deferred.resolve(parseDownloadUrl(singleMetadata, albumPageResponse, configFactory.CDNPrefix));
            });

            return deferred.promise;
        }

        function getMetadata(single) {
            var deferred = $q.defer();
            getPlayUrl(single).then(onSuccess, onError);

            return deferred.promise;

            function onSuccess(playUrl) {
                deferred.resolve(parseMetadataFromUrl(playUrl));
            }

            function onError() {
                deferred.reject('Error occurred when get single metadata!');
            }
        }

        function getPlayUrl(single) {
            var deferred = $q.defer();

            var data = {method: 'HEAD', url: single.url};
            var request = sentRequest(data, onSuccess);

            function onSuccess() {
                deferred.resolve(request.responseURL)
            }

            return deferred.promise
        }
    }

    function parseDownloadUrl(singleMetadata, response, CDNPrefix) {
        console.log(response, 'download url');
        var singleElements = $("#luooPlayerPlaylist .track-item", response);

        var singleIndex = undefined;
        angular.forEach(singleElements, function (element, index) {
            if (angular.isUndefined(singleIndex)) {
                var idSelector = 'track' + singleMetadata.singleId;
                console.log(idSelector, element.attribs.id, typeof idSelector, typeof element.attribs.id);
                if (element.attribs.id === idSelector) {
                    singleIndex = index
                }
            }
        });

        singleIndex = singleIndex + 1;
        var indexData = singleIndex > 10 ? singleIndex.toString() : '0' + singleIndex.toString()

        return CDNPrefix + singleMetadata.albumId + '/' + indexData + ".mp3";
    }

    function parseMetadataFromUrl(url) {
        var singleUrlPattern = /music\/(\d+)\?sid=(\d+)$/;
        var result = singleUrlPattern.exec(url);
        console.log(result, result[1], result[2]);

        return {
            'albumId': result[1],
            'singleId': result[2]
        }
    }

    function sentRequest(data, onSuccess) {
        var x = new XMLHttpRequest();
        x.open(data.method, data.url);
        if (data.responseType) {
            x.responseType = data.responseType;
        }
        x.onload = onSuccess;
        x.send(null);

        return x;
    }
})();
