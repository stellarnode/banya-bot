'use strict';

var util = require("util");
var mongoose = require('mongoose');
var path = process.cwd();
require('dotenv').load();
mongoose.connect(process.env.MONGO_URI);

var BanyaUsers = require('./app/models/banyaUsers.js');
var checkUser = require("./app/models/checkUser.js");

var start = require("./app/controllers/commands/start.js");
var help = require("./app/controllers/commands/help.js");
var motivateme = require("./app/controllers/commands/motivateme.js");
var trollme = require("./app/controllers/commands/trollme.js");
var trolluser = require("./app/controllers/commands/trolluser.js");
var requestfeature = require("./app/controllers/commands/requestfeature.js");

var TeaBot = require("teabot")(process.env.BOT_TOKEN, process.env.BOT_NAME);

function getName(dialog) {
    return dialog.message.from.first_name || dialog.message.from.username;
}


TeaBot.onError(function (e) {
    console.error('TeaBot error:', e.stack);
});

TeaBot
    .defineCommand('/start', function (dialog) {
        // console.log(util.inspect(dialog.message.from));
        console.log(new Date().toISOString(), "command \/start request from: ", getName(dialog));
        dialog
          .setKeyboard()
          .sendMessage(start(getName(dialog)));
    })
    .defineCommand('/help', function (dialog) {
        console.log(new Date().toISOString(), "command \/help request from: ", getName(dialog));
        dialog
          .setKeyboard()
          .sendMessage(help(getName(dialog)));
    })
    .defineCommand('/motivateme', function (dialog) {
        console.log(new Date().toISOString(), "command \/motivateme request from: ", getName(dialog));
        dialog
          .setKeyboard()
          .sendMessage(motivateme());
    })
    .defineCommand('/trollme', function (dialog) {
        console.log(new Date().toISOString(), "command \/trollme request from: ", getName(dialog));
        dialog.setKeyboard();
        trollme(dialog.message, function(response) {
            dialog.sendMessage(response);
        });
    })
    .defineCommand('/requestfeature', function (dialog) {
        console.log(new Date().toISOString(), "command \/requestfeature request from: ", getName(dialog));
        dialog.startAction('/requestfeature').sendMessage("Опиши предлагаемую фичу. Только коротко.");
    })
    .defineCommand('/cancel', function (dialog) {
        if (dialog.inAction()) {
            dialog
                .setKeyboard()
                .endAction()
                .sendMessage('Как скажешь. Если что, поддать парка можно с помощью /help.');
        }
    })
    .defineCommand(function (dialog) {
        console.log(new Date().toISOString(), "unknown command request from: ", getName(dialog));
        dialog.sendMessage('Это я не понял. Отправь мне /help, что ли.');
    });


TeaBot
    .defineAction('/requestfeature', function(dialog, message) {
        var description = message.getArgument();
        requestfeature(message, description, function(features) {
            dialog.endAction();
            dialog.sendMessage("Сохранил твое предложение. Парься дальше.");
        });
    });

 
console.log(new Date().toISOString(), "Banya Bot proudly started...");
TeaBot.startPolling();