(function () {
    var angular = require('angular');

    angular.module('luooApp', []);

    require('./config.js');
    require('./download.service.js');
    require('./luoo.service.js');
    require('./luoo-user.repository.js');
    require('./luoo.controller.js');
})();
