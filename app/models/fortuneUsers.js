'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FortuneUser = new Schema({
	user: {
		userid: String,
		firstName: String,
		username: String,
        lastRequest: { type: Date, default: Date.now }
	},
   replies: Array,
});

module.exports = mongoose.model('FortuneUser', FortuneUser);