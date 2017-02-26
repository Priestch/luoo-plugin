(function () {
    angular.module('luooApp')
        .service('downloadService', downloadService);

    downloadService.$inject = ["$http", "configFactory"];
    function downloadService($http, configFactory) {
        this.downloadSong = downloadSong;

        function downloadSong(single) {
            console.log("download in service");
            var urlPattern = /single\/(\d+)$/;
            var songId = urlPattern.exec(single.url)[1];

            var songUrl = configFactory.backendServer + "api/songs/" + songId;
            download_by_browser(songUrl, $http);
        }
    }

    function download_by_browser(songUrl, httpService) {
        function onSuccess(response) {
            var filename = response.data.title + ".mp4";
            var downloadData = {filename: filename, url: response.data.url};
            console.log('Downloading', downloadData.filename, 'from', downloadData.url);
            chrome.downloads.download(downloadData, function (downloadId) {});
        }

        httpService.get(songUrl).then(onSuccess)
    }
})();
