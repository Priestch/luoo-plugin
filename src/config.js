(function () {
    angular.module('luooApp')
        .factory('configFactory', configFactory);

    function configFactory() {
        return {
            loginUrl: "http://www.luoo.net/login/user",
            profilePrefix: "http://www.luoo.net/user/",
            backendServer: "http://priestch.com:5000/",
            profilePagePrefix: "http://www.luoo.net/user/singles"
        }
    }
})();
