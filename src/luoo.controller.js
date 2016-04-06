(function () {
    angular.module('luooApp')
        .controller('LuooController', LuooController);

    LuooController.$inject = ['luooService'];

    function LuooController(luooService) {
        var vm = this;

        vm.download = function (song) {
            console.log(song);
            luooService.downloadSong(song)
        };

        function activate() {
            getLoginUser().then(function () {
                console.log('User ' + vm.user.userName + ' login successfully...');

                getUserFavouriteSongs().then(function () {
                    console.log('Length of user ' + vm.user.userName + ' favourite songs is ' + vm.userFavouriteSongs.length)
                })

            });
        }

        activate();

        return vm;

        function getLoginUser() {
            return luooService.login().then(function (loginUser) {
                console.log('init vm.user');
                vm.user = loginUser;
            })
        }

        function getUserFavouriteSongs() {
            return luooService.getUserFavouriteSongs(vm.user.userId).then(function (userFavouriteSongs) {
                vm.userFavouriteSongs = userFavouriteSongs;
            });
        }
    }
})();
