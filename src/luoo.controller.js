(function () {
    angular.module('luooApp')
        .controller('LuooController', LuooController);

    LuooController.$inject = ['userRepository', 'luooService'];

    function LuooController(userRepository, luooService) {
        var vm = this;
        vm.download = function (song) {
            luooService.downloadSong(song)
        };

        vm.changePage = changePage;

        activate();

        function activate() {
            getLoginUser().then(initUser);
        }

        function initUser() {
            getFavouriteSongs();
            getPagination();
        }

        function getLoginUser() {
            return userRepository.initUser().then(function () {
                vm.user = userRepository.user;
            })
        }

        function getFavouriteSongs() {
            luooService.getUserFavouriteSongs().then(function (userFavouriteSongs) {
                vm.userFavouriteSongs = userFavouriteSongs;
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
