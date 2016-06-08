(function () {
    angular.module('luooApp')
    .controller('LuooController', LuooController);

    LuooController.$inject = ['userRepository', 'luooService'];

    function LuooController(userRepository, luooService) {
        var vm = this;
        vm.download = function (song) {
            console.log(song);
            luooService.downloadSong(song)
        };

        activate();

        function activate() {
            getLoginUser().then(function () {
                console.log('User ' + vm.user.userName + ' login successfully...');

                getUserFavouriteSongs(vm.user.userId).then(function () {
                    console.log('Length of user ' + vm.user.userName + ' favourite songs is ' + vm.userFavouriteSongs.length)
                })

            });
        }

        function getLoginUser() {
            return userRepository.initUser().then(function () {
                console.log('init vm.user');
                vm.user = userRepository.user;
            })
        }

        function getUserFavouriteSongs() {
            return luooService.getUserFavouriteSongs(vm.user.userId).then(function (userFavouriteSongs) {
                vm.userFavouriteSongs = userFavouriteSongs;
            });
        }
    }
})();
