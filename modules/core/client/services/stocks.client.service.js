(function () {
  'use strict';

  angular
    .module('core')
    .factory('StocksService', StocksService);

  StocksService.$inject = ['$resource'];

  function StocksService($resource) {
    var resource = $resource('api/stocks/:stockId',
      { stockId: '@_id' },
      {
        update: { method: 'PUT' },
        history: { url: '/api/stocks/history', method: 'GET' }
      }
    );

    return resource;
  }
})();
