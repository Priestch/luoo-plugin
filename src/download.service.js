(function () {
    angular.module('luooApp')
        .service('downloadService', downloadService);

    var songsJson;

    function downloadService() {
        this.downloadSong = downloadSong;

        function downloadSong(single) {
            var data = {method: "GET", url: chrome.extension.getURL('/json/songs.json')};
            var xhr = sentRequest(data, onSuccess);

            function onSuccess() {
                songsJson = JSON.parse(xhr.response);
                var urlPattern = /single\/(\d+)$/;
                var songId = urlPattern.exec(single.url)[1];
                var song = songsJson[songId];
                download({filename: song.title + ".mp3", url: song.mp3});
            }
        }
    }

    function download(downloadData) {
        console.log('Downloading', downloadData.filename, 'from', downloadData.url);
        chrome.downloads.download(downloadData, function (downloadId) {
            console.log(downloadId);
        });
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
