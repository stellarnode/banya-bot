'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BanyaUser = new Schema({
	userid: Number,
	user: {
		firstName: String,
		secondName: String,
		username: String,
		phoneNumber: String
	},
	previousCommand: String,
   	replies: Array,
   	trollPhrases: Array,
   	createdAt: { type: Date, default: Date.now },
   	lastRequest: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BanyaUser', BanyaUser);