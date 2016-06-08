(function () {
    angular.module('luooApp')
        .factory('configFactory', configFactory);

    function configFactory() {
        return {
            loginUrl: "http://www.luoo.net/login/user",
            profilePrefix: "http://www.luoo.net/user/",
            CDNPrefix: "http://luoo-mp3.kssws.ks-cdn.com/low/luoo/radio"
        }
    }
})();
