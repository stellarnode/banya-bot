'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Counter = new Schema({
	counter: Number,
    offset: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', Counter);