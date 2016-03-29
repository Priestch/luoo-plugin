var $ = require('cheerio');

module.exports = ['$q', function ($q) {
    var deferredLogin = $q.defer();
    var deferredSongs = $q.defer();

    this.login = login;
    this.getUserFavouriteSongs = getUserFavouriteSongs;

    function login() {
        var loginUser = {};

        var x = new XMLHttpRequest();
        var loginUrl = "http://www.luoo.net/login/user";
        x.open('GET', loginUrl);
        x.responseType = 'json';
        x.onload = onSuccess;
        x.send(null);

        function onSuccess() {
            var response = x.response;
            if (response.status === 1) {
                loginUser.userName = response.data.user_name;
                loginUser.userId = response.data.uid;
                loginUser.userAvatar = response.data.user_avatar;
                deferredLogin.resolve(loginUser);
            }
        }

        return deferredLogin.promise;
    }

    function getUserFavouriteSongs(userId) {
        var x = new XMLHttpRequest();
        var loginUrl = "http://www.luoo.net/user/" + userId;
        x.open('GET', loginUrl);
        x.onload = onSuccess;
        x.send(null);

        function onSuccess() {
            var response = x.response;
            var favouriteSongs = parseFavSingles(response);
            deferredSongs.resolve(favouriteSongs);
        }

        return deferredSongs.promise;
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

    function getPaginatorCount(response) {
        var pageElements = $("paginator .page", response);
        return pageElements.length;
    }
}];
