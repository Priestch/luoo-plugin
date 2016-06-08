(function () {
    var $ = require('cheerio');

    angular.module('luooApp')
        .service('luooService', luooService);

    luooService.$inject = ['$q', '$http', 'downloadService', 'configFactory'];

    function luooService($q, $http, downloadService, configFactory) {
        this.login = login;
        this.getUserFavouriteSongs = getUserFavouriteSongs;
        this.downloadSong = downloadService.downloadSong;

        function login () {
            return $http.get(configFactory.loginUrl);
        }

        function getUserFavouriteSongs (userId) {
            var profileUrl = configFactory.profilePrefix + userId;
            $http.get(profileUrl).then(onSuccess, onError);

            var deferredSongs = $q.defer();
            return deferredSongs.promise;

            function onSuccess(response) {
                deferredSongs.resolve(parseFavSingles(response.data));
            }

            function onError() {
                deferredSongs.reject('Error occurred when get user favourite songs!');
            }
        }

        function getPaginatorCount(response) {
            var pageElements = $("paginator .page", response);
            return pageElements.length;
        }
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
})();
