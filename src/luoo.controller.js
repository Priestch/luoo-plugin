(function () {
    angular.module('luooApp')
        .controller('LuooController', LuooController);

    LuooController.$inject = ['userRepository', 'luooService'];

    function LuooController(userRepository, luooService) {
        var vm = this;
        vm.download = function (song) {
            console.log('Starting download', song.name, song.url);
            luooService.downloadSong(song)
        };

        vm.changePage = changePage;

        activate();

        function activate() {
            getLoginUser().then(initUser);
        }

        function initUser() {
            console.log('User ' + vm.user.userName + ' login successfully...');

            getFavouriteSongs();
            getPagination();
        }

        function getLoginUser() {
            return userRepository.initUser().then(function () {
                console.log('init vm.user');
                vm.user = userRepository.user;
            })
        }

        function getFavouriteSongs() {
            luooService.getUserFavouriteSongs().then(function (userFavouriteSongs) {
                vm.userFavouriteSongs = userFavouriteSongs;
                console.log('Length of user ' + vm.user.userName + ' favourite songs is ' + vm.userFavouriteSongs.length)
            });
        }

        function getPagination() {
            luooService.getPaginationCount().then(function (count) {
                var pages = [];
                for (var i = 1; i <= count; i++) {
                    var page = {
                        value: i,
                        active: false
                    };
                    if (i == 1) {
                        page.active = true;
                    }
                    pages.push(page)
                }
                vm.pages = pages;
            })
        }

        function changePage (page) {
            luooService.getFavouriteSongsPerPage(page.value).then(function (userFavouriteSongs) {
                vm.userFavouriteSongs = userFavouriteSongs;
                deactivePages();
                page.active = true
            })
        }

        function deactivePages() {
            angular.forEach(vm.pages, function (page) {
                page.active = false
            })
        }
    }
})();
