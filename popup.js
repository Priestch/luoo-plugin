var angular = require('angular');

angular.module('luooApp', [])
    .factory('luooService', require('./luoo.service'))
    .controller('luooController', ['luooService', function (luooService) {
        console.log(333);
    }]);
