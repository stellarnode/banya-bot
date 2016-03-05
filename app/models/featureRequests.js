'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeatureRequest = new Schema({
	id: Number,
	requestedFeature: String,
	proposedBy: {
	    userid: Number,
		firstName: String,
		secondName: String,
		username: String,
	},
   	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FeatureRequest', FeatureRequest);