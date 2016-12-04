'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');
  var stocks = require('../controllers/stocks.server.controller');


  app.route('/api/stocks/search/:query')
    .get(stocks.search);

  app.route('/api/stocks/history')
    .get(stocks.history);

  app.route('/api/stocks')
    .get(stocks.list)
    .post(stocks.create);

  app.route('/api/stocks/:stockId')
    .delete(stocks.delete);

  app.param('stockId', stocks.stockById);

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);
};
