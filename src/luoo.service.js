(function () {
    var $ = require('cheerio');

    angular.module('luooApp')
        .service('luooService', luooService);

    luooService.$inject = ['$q', 'loginUrl', 'profilePrefix', 'CDNPrefix'];

    function luooService($q, loginUrl, profilePrefix, CDNPrefix) {
        var deferredLogin = $q.defer();
        var deferredSongs = $q.defer();

        this.login = login;
        this.getUserFavouriteSongs = getUserFavouriteSongs;
        this.downloadSong = downloadSong;

        function login() {
            var data = {method: 'GET', url: loginUrl, responseType: 'json'};
            var request = sentRequest(data, onSuccess);

            function onSuccess() {
                var response = request.response;
                if (response.status === 1) {
                    var loginUser = {
                        userName: response.data.user_name,
                        userId: response.data.uid,
                        userAvatar: response.data.user_avatar
                    };
                    deferredLogin.resolve(loginUser);
                }
                else {
                    deferredLogin.resolve(null);
                }
            }

            return deferredLogin.promise;
        }

        function getUserFavouriteSongs(userId) {
            var profileUrl = profilePrefix + userId;
            var data = {method: 'GET', url: profileUrl};
            var request = sentRequest(data, onSuccess);

            function onSuccess() {
                var response = request.response;
                deferredSongs.resolve(parseFavSingles(response));
            }

            return deferredSongs.promise;
        }

        function downloadSong(single) {
            function downloadCallback(downloadId) {
                console.log(downloadId);
            }
            function onSuccess(downloadURL) {
                console.log(downloadURL);
                chrome.downloads.download({filename: single.name + ".mp3", url: downloadURL}, downloadCallback);
            }
            getDownloadData(single).then(function (downloadData) {
                single.downloadData = downloadData;
                getDownloadURL(single).then(onSuccess)
            })
        }


        function parseFavSingles(response) {
            var favouriteSongs = [];

            var singleElements = $("#luooPlayerPlaylist .track-item", response);
            angular.forEach(singleElements, function (element) {
                favouriteSongs.push(parseFavSingle(element));
            });

            return favouriteSongs;
        }

        function parseFavSingle(element) {
            var single = {};

            var nameElement = $(".track-detail-wrapper .player-wrapper .name a", element);
            single.name = nameElement.text();
            single.url = nameElement.attr('href');
            single.artist = $(".track-wrapper .artist", element).text();
            single.duration = $(".track-wrapper .duration .total-time", element).text();

            return single;
        }

        function getDownloadURL(single) {
            var deferred = $q.defer();
            var data = {method: 'GET', url: single.url};
            var request = sentRequest(data, onSuccess);

            function onSuccess() {
                var singleElements = $("#luooPlayerPlaylist .track-item", request.response);

                var singleIndex = undefined;
                angular.forEach(singleElements, function (element, index) {
                    if (angular.isUndefined(singleIndex)) {
                        var idSelector = 'track' + single.downloadData.singleId;
                        console.log(idSelector, element.attribs.id, typeof idSelector, typeof element.attribs.id);
                        if (element.attribs.id === idSelector) {
                            singleIndex = index
                        }
                    }
                });

                singleIndex = singleIndex + 1;
                var indexData = singleIndex > 10 ? singleIndex.toString() : '0' + singleIndex.toString()

                var downloadURL = CDNPrefix + single.downloadData.musicId + '/' + indexData + ".mp3";
                deferred.resolve(downloadURL)
            }

            return deferred.promise
        }

        function getDownloadData(single) {
            var deferred = $q.defer();
            var data = {method: 'HEAD', url: single.url};
            var request = sentRequest(data, onSuccess);

            function onSuccess() {
                deferred.resolve(parseDownloadData(request.responseURL))
            }

            return deferred.promise
        }

        function getPaginatorCount(response) {
            var pageElements = $("paginator .page", response);
            return pageElements.length;
        }
    }

    function parseDownloadData(responseURL) {
        var urlComponents = responseURL.split('?');

        var baseComponents = urlComponents[0].split('/');
        var musicId = baseComponents[baseComponents.length-1];

        var parameters = urlComponents[1].split('=');
        if (parameters.length != 2) {
            console.log('error happened! Response url is: ', responseURL);
            return
        }
        var singleId = parameters[parameters.length-1];

        return {
            'musicId': musicId,
            'singleId': singleId
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
