'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Stock Schema
 */
var StockSchema = new Schema({
  symbol: {
    type: String,
    default: '',
    required: 'Please fill stock symbol',
    trim: true
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill stock name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('Stock', StockSchema);
