var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NextBanya = new Schema({
	setByUserId: String,
	chatId: String,
	nextDay: Number,
	setOn: { type: Date, default: Date.now },
	setFor: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NextBanya', NextBanya);