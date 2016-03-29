var angular = require('angular');

angular.module('luooApp', [])
    .service('luooService', require('./luoo.service'))
    .controller('luooController', ['luooService', function (luooService) {
        var that = this;
        luooService.login().then(function (loginUser) {
            that.user = loginUser;
            luooService.getUserFavouriteSongs(that.user.userId).then(function (userFavouriteSongs) {
                that.userFavouriteSongs = userFavouriteSongs;
            });
        })
    }]);
