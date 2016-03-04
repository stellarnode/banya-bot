'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BanyaUser = new Schema({
	userid: Number,
	user: {
		firstName: String,
		secondName: String,
		username: String,
	},
   replies: Array,
   trollPhrases: Array,
   lastRequest: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BanyaUser', BanyaUser);