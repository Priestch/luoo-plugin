(function () {
    angular.module('luooApp')
        .factory('configFactory', configFactory);

    function configFactory() {
        return {
            loginUrl: "http://www.luoo.net/login/user",
            profilePrefix: "http://www.luoo.net/user/",
            backendServer: "http://localhost:8000/",
            profilePagePrefix: "http://www.luoo.net/user/singles"
        }
    }
})();
