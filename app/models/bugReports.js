'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BugReport = new Schema({
	id: Number,
	reportedBug: String,
	reportedBy: {
	    userid: Number,
		firstName: String,
		secondName: String,
		username: String,
	},
   	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BugReport', BugReport);
