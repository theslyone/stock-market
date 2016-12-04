'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state',
  function ($scope, $state) {
    // Expose view variables
    $scope.$state = $state;
  }
]);
