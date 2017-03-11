(function () {
    var $ = require('cheerio');

    angular.module('luooApp')
        .service('luooService', luooService);

    luooService.$inject = ['$q', '$http', 'downloadService', 'configFactory', 'userRepository'];

    function luooService($q, $http, downloadService, configFactory, userRepository) {
        this.getUserFavouriteSongs = getUserFavouriteSongs;
        this.getPaginationCount = getPaginationCount;
        this.getFavouriteSongsPerPage = getFavouriteSongsPerPage;
        this.downloadSong = downloadService.downloadSong;

        activate();

        var user = userRepository.user;

        var profileUrl, deferredProfilePage;

        function activate() {
            userRepository.initUser().then(function () {
                profileUrl = configFactory.profilePrefix + userRepository.user.userId;
                deferredProfilePage = $http.get(profileUrl);
            });
        }

        function getUserFavouriteSongs(page) {
            deferredProfilePage.then(onSuccess, onError);

            var deferredSongs = $q.defer();
            return deferredSongs.promise;

            function onSuccess(response) {
                deferredSongs.resolve(parseFavSingles(response.data));
            }

            function onError() {
                deferredSongs.reject('Error occurred when get user favourite songs!');
            }
        }

        function getFavouriteSongsPerPage(pageNumber) {
            var pageUrl = configFactory.profilePagePrefix + "?p=" + pageNumber;
            $http.get(pageUrl).then(onSuccess, onError);

            var deferredSongsPerPage = $q.defer();
            return deferredSongsPerPage.promise;

            function onSuccess(response) {
                deferredSongsPerPage.resolve(parseFavSingles(response.data));
            }

            function onError() {
                var message = 'Error occurred when get {} favourite songs, page: {}!'.format(userRepository.user.userName, pageNumber);
                deferredSongsPerPage.reject(message);
            }
        }

        function getPaginationCount() {
            deferredProfilePage.then(onSuccess);

            var deferredCount = $q.defer();
            return deferredCount.promise;

            function onSuccess(response) {
                var pageElements = $(".paginator .page", response.data);
                deferredCount.resolve(pageElements.length);
            }
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
