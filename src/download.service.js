(function () {
    angular.module('luooApp')
        .service('downloadService', downloadService);

    downloadService.$inject = ['$http', '$q'];

    function downloadService($http, $q) {
        this.downloadSong = downloadSong;

        function downloadSong(single) {
            var data = {method: "GET", url: chrome.extension.getURL('/json/songs.json')};
            var xhr = sentRequest(data, onSuccess);

            function onSuccess() {
                var songs = JSON.parse(xhr.response);
                var urlPattern = /single\/(\d+)$/;
                var songId = urlPattern.exec(single.url)[1];
                var song = songs[songId];
                console.log('Downloading', single.name, '(' + song.mp3 + ')');
                chrome.downloads.download({filename: single.name + ".mp3", url: song.mp3}, downloadCallback);
            }
        }


        function downloadCallback(downloadId) {
            console.log(downloadId);
        }
    }

    function sentRequest(data, onSuccess) {
        var x = new XMLHttpRequest();
        x.open(data.method, data.url);
        if (data.responseType) {
            x.responseType = data.responseType;
        }
        x.onload = onSuccess;
        x.send(null);

        return x;
    }
})();
