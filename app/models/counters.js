'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Counter = new Schema({
	counter: Number,
    offset: Number
});

module.exports = mongoose.model('Counter', Counter);