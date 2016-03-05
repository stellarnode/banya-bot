'use strict';

var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');

var path = process.cwd();

var BotController = require(path + '/app/controllers/botController.server.js');
var botController = new BotController();
var botCounter;
botController.startCounter(function(id) {
	botCounter = id;
	console.log("botCounter ID: ", botCounter);
});

var https = require('https');

var app = express();
require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

var checkBot = setInterval(botController.getUpdates, 5000);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});