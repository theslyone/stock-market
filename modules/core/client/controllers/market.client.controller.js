'use strict';

angular.module('core').controller('MarketController', ['$scope', 'StocksService', 'Socket',
  function ($scope, StocksService, Socket) {
    $scope.mainCaption = "Stock Market!";
    $scope.remoteSearch = '/api/stocks/search/{query}';

    $scope.watchStock = function(){
      var stock = new StocksService();
      stock.symbol = $scope.symbol.title;
      StocksService.save({ symbol: $scope.symbol.title }, successCallback, errorCallback);
      $scope.symbol = null;
    };
    $scope.removeStock = function(stock){
      StocksService.remove({ stockId: stock._id }, successCallback, errorCallback);
    };

    function successCallback(res) {
      Socket.emit('stock:updated');
    }
    function errorCallback(res) {
      console.log(res);
    }

    Socket.on('stock:updated', function(stock){
      console.log("Socket received: stock:updated");
      $scope.update();
    });

    $scope.update = function(){
      StocksService.query().$promise
      .then(function(stocks){
        $scope.stocks = stocks;
        StocksService.history().$promise
        .then(function(data){
          $scope.highstockChatConfig.series = [];
          var symbols = stocks.map(function(stock){ return stock.symbol; });//Object.keys(data);
          symbols.forEach(function(symbol, idx){
            $scope.highstockChatConfig.series[idx] = {
              name: symbol,
              data: data[symbol]
            };
          });
        });
      });
    };

    $scope.highstockChatConfig = {
      options: {
        chart: {
          zoomType: 'x'
        },
        rangeSelector: {
          enabled: true
        },
        navigator: {
          enabled: true
        }
      },
      rangeSelector: {
        selected: 1
      },
      series: [],
      title: {
        text: $scope.mainCaption
      },
      xAxis: {
        type: 'datetime',
      },
      useHighStocks: true,
    };
  }
]);
