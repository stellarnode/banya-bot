'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BanyaUser = new Schema({
	user: {
		userid: Number,
		firstName: String,
		username: String,
        lastRequest: { type: Date, default: Date.now }
	},
   replies: Array,
});

module.exports = mongoose.model('BanyaUser', BanyaUser);