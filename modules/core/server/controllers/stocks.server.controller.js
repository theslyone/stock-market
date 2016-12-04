'use strict';
var markitondemand = require('markitondemand');
var path = require('path'),
  mongoose = require('mongoose'),
  chalk = require('chalk'),
  Stock = mongoose.model('Stock'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  yahooFinance = require('yahoo-finance'),
  moment = require('moment'),
  socket = require('socket.io');

exports.search = function (req, res) {
  markitondemand.getStock(req.params.query)
  .then(function(data){
    var response = data.map(function(val){
      return { title: val.Symbol };
    });
    res.jsonp({ results: response });
  })
  .catch(function(error) {
    console.error(error.message);
    res.jsonp([]);
  });
};

exports.list = function (req, res) {
  Stock.find().exec(function(err, stocks){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else{
      res.jsonp(stocks);
    }
  });
};

exports.history = function (req, res) {
  Stock.find().exec(function(err, stocks){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else{
      var to = moment().startOf('day');
      var from = moment(to).add(-120, 'days');
      var symbols = stocks.map(function(stock){ return stock.symbol; });

      if(symbols.length > 0){
        yahooFinance.historical({
          symbols: symbols,
          from: '2016-05-05',//from.format('YYYY-MM-DD'),
          to: '2016-12-04',//to.format('YYYY-MM-DD'),
          // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
        }, function (err, quotes) {
          var response = {};
          var keys = Object.keys(quotes);
          console.log("history: " + keys.length);
          keys.forEach(function(key){
            var value = quotes[key];
            value = value.map(function(val){
              var unixTime = moment(val.date, "MM/DD/YYYY HH:mm").unix()*1000;
              var close = val.close;
              return [unixTime, close];
            });
            response[key] = value;
          });
          res.jsonp(response);
        });
      }
      else{
        res.jsonp({});
      }
    }
  });
};

exports.create = function(req, res) {
  Stock.findOne({ symbol: req.body.symbol }).exec(function(err, stock){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else if(stock) {
      res.jsonp(stock);
    }
    else{
      markitondemand.getQuote(req.body.symbol)
      .then(function(data){
        var stock = new Stock();
        stock.symbol = data.Symbol;
        stock.name = data.Name;
        stock.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(stock);
          }
        });
      })
      .catch(function(error) {
        console.error(error.message);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(error)
        });
      });
    }
  });
};

exports.delete = function(req, res) {
  var stock = req.stock;

  stock.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stock);
    }
  });
};

exports.stockById = function(req, res, next, stockId) {
  console.log("Stock Id: " + stockId);

  Stock.findById(stockId)
  .exec(function (err, stock) {
    if (err) {
      return next(err);
    } else if (!stock) {
      return res.status(404).send({
        message: 'No Stock with that identifier has been found'
      });
    }
    req.stock = stock;
    next();
  });
};
