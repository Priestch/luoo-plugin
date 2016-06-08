(function () {
    var angular = require('angular');

    angular.module('luooApp', []);

    require('./download.service.js');
    require('./config.js');
    require('./luoo.service.js');
    require('./luoo-user.repository.js');
    require('./luoo.controller.js');
})();
