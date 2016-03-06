'use strict';

var util = require("util");
var mongoose = require('mongoose');
var path = process.cwd();
require('dotenv').load();

if (process.env.MONGOLAB_URI) {
    mongoose.connect(process.env.MONGOLAB_URI);
} else {
    mongoose.connect(process.env.MONGO_URI);
}


var BanyaUsers = require('./app/models/banyaUsers.js');
var checkUser = require("./app/models/checkUser.js");

var start = require("./app/controllers/commands/start.js");
var help = require("./app/controllers/commands/help.js");
var motivateme = require("./app/controllers/commands/motivateme.js");
var trollme = require("./app/controllers/commands/trollme.js");
var trolluser = require("./app/controllers/commands/trolluser.js");
var requestfeature = require("./app/controllers/commands/requestfeature.js");
var reportbug = require("./app/controllers/commands/reportbug.js");

var TeaBot = require("teabot")(process.env.BOT_TOKEN, process.env.BOT_NAME);
TeaBot.use('analytics', require('teabot-botan')(process.env.BOTAN_TOKEN));


function printFrom(dialog) {
    var from = {
        id: dialog.message.from.id,
        username: dialog.message.from.username,
        first_name: dialog.message.from.first_name,
        last_name: dialog.message.from.last_name
    };
    var command = dialog.message.command;
    console.log(new Date().toISOString(), "command " + command + " request from: ", from.id, from.username, from.first_name, from.last_name);
}

function getName(dialog) {
    return dialog.message.from.first_name || dialog.message.from.username;
}

function getCurrentUsers(next) {
    BanyaUsers.find({}, function(err, users) {
        if (err) console.error(err);
        next(users);
    });
}

function userExists(name, next) {
    BanyaUsers.findOne({ $or: [ { 'user.secondName': name }, { 'user.firstName': name } ]}, function(err, user) {
        if (err) console.error(err);
        console.log("--- found this user: ", user.userid, user.user.username, user.user.firstName, user.user.secondName);
        if (next) { next(user); } else return user;
    });
}

function prepareTempData(data, user) {
    data.userid = user.userid;
    data.user = {
        firstName: user.user.firstName,
        secondName: user.user.secondName
    };
    return data;
}


TeaBot.onError(function (e) {
    console.error('TeaBot error:', e.stack);
});


// COMMANDS //

TeaBot
    .defineCommand('/start', function (dialog) {
        // console.log(util.inspect(dialog.message.from));
        printFrom(dialog);
        checkUser(dialog.message, function(user) {
            dialog
                .setKeyboard()
                .sendMessage(start(getName(dialog)));
        });
        
    })
    
    .defineCommand('/help', function (dialog) {
        printFrom(dialog);
        dialog
          .setKeyboard()
          .sendMessage(help(getName(dialog)));
    })
    
    .defineCommand('/motivateme', function (dialog) {
        printFrom(dialog);
        dialog
          .setKeyboard()
          .sendMessage(motivateme());
    })
    
    .defineCommand('/trollme', function (dialog) {
        printFrom(dialog);
        dialog.setKeyboard();
        trollme(dialog.message, function(response) {
            dialog.sendMessage(response);
        });
    })
    
    .defineCommand('/trolluser', function(dialog) {
        printFrom(dialog);
        dialog.startAction('/trolluser');
        getCurrentUsers(function(users) {
            var keyboard = [];
            users.forEach((el) => {
                keyboard.push(new Array((el.user.secondName) ? el.user.firstName + " " + el.user.secondName : el.user.firstName));
            });
            keyboard.push(['другого']);
            keyboard.push(['/cancel']);
            
            dialog.setKeyboard(keyboard, true, true);
            dialog.sendMessage("Кого ты хочешь потроллить (скролл работает, если что)?");
        });
        
    })
    
    .defineCommand('/requestfeature', function (dialog) {
        printFrom(dialog);
        dialog.startAction('/requestfeature').sendMessage("Опиши предлагаемую фичу. Только коротко.");
    })
    
    .defineCommand('/reportbug', function (dialog) {
        printFrom(dialog);
        dialog.startAction('/reportbug').sendMessage("Опиши найденную ошибку. Только коротко.");
    })
    
    .defineCommand('/cancel', function (dialog) {
        printFrom(dialog);
        if (dialog.inAction()) {
            dialog
                .setKeyboard()
                .endAction()
                .sendMessage('Как скажешь. Если что, поддать парка можно с помощью /help.');
        }
    })
    
    .defineCommand(function (dialog) {
        printFrom(dialog);
        dialog.sendMessage('Это я не понял. Отправь мне /help, что ли.');
    });


// ACTIONS //

TeaBot
    .defineAction('/requestfeature', function(dialog, message) {
        var description = message.getArgument();
        requestfeature(message, description, function(features) {
            dialog.endAction();
            dialog.sendMessage("Сохранил твое предложение. Парься дальше.");
        });
    })
    
    .defineAction('/reportbug', function(dialog, message) {
        var description = message.getArgument();
        reportbug(message, description, function(bug) {
            dialog.endAction();
            dialog.sendMessage("Сохранил твое сообщение. Легкого пара.");
        });
    })
    
    .defineAction('/trolluser', function(dialog, message) {
        
        var data = {};
        var keyboardPress = message.getArgument().split(" ")[1] || message.getArgument().split(" ")[0];
        
        console.log("--- got this when reacted to keyboard press: ", keyboardPress);
        
        if (keyboardPress === 'другого') {
            dialog
                .endAction(true)
                .setKeyboard()
                .startAction('/trolluser:manual')
                .sendMessage('OK, пиши сам руками тогда.');
        } else {
            userExists(keyboardPress, function(user) {
                if (user) {
                    data = prepareTempData(data, user);
                    dialog.setTempData('data', data);
                    dialog
                        .endAction(true)
                        .setKeyboard()
                        .startAction('/trolluser:phrase')
                        .sendMessage("Пиши фразу, чтобы добавить в его копилку. Когда он будет себя троллить, она будет выбираться случайным образом среди других.");

                } else {
                    dialog
                        .endAction(true)
                        .setKeyboard()
                        .startAction('/trolluser:contact')
                        .sendMessage("Запутался в своих записях. Пришли его телеграмовские контакты. Так надежнее.");
                }
            });
        }
    })
    
    .defineAction('/trolluser:manual', function(dialog, message) {
        var data = dialog.getTempData('data') || {};
        var userLastName = message.getArgument();
        userExists(userLastName, function(user) {
            if (user) {
                data = prepareTempData(data, user);
                dialog.setTempData('data', data);
                dialog
                    .endAction(true)
                    .setKeyboard()
                    .startAction('/trolluser:phrase')
                    .sendMessage("Пиши фразу, чтобы добавить в его копилку. Когда он будет себя троллить, она будет выбираться случайным образом среди других.");
            } else {
                dialog
                    .endAction(true)
                    .setKeyboard()
                    .startAction('/trolluser:contact')
                    .sendMessage("Не нашел такого в своих записях. Или просмотрел. Шли его телеграмовские контакты. Так надежнее.");
            }
        });
    })
    
    .defineAction('/trolluser:phrase', function(dialog, message) {
        var data = dialog.getTempData('data') || {};
        data.phrase = message.getArgument();
        trolluser.addTrollPhrase(data, function(user) {
            dialog
                .endAction()
                .setKeyboard();
            if (user) {
                dialog.sendMessage("Добавил, короче, ему в список.");
            } else {
                dialog.sendMessage("Что-то не получилось у меня. Попробуй еще раз как-нибудь.");
            }
        });
    })
    
    .defineAction('/trolluser:contact', function(dialog, message) {
        // console.log("--- contact received: ", message);
        
        var data = dialog.getTempData('data') || {};
        
        trolluser.addUserFromContact(message.contact, function(user) {
            if (user) {
                data = prepareTempData(data, user);
                dialog.setTempData('data', data);
                dialog
                    .endAction(true)
                    .setKeyboard()
                    .startAction('/trolluser:phrase')
                    .sendMessage("Контакт запомнил. Пиши теперь фразу, чтобы добавить в его копилку. Когда он будет себя троллить, она будет выбираться случайным образом среди других.");
            } else {
                dialog
                    .endAction()
                    .setKeyboard()
                    .sendMessage("Что-то пошло не так. Сложный юзер. Не смог запомнить.");
            }
            
        });
        
    });
    

 
console.log(new Date().toISOString(), "BANYA BOT PROUDLY STARTED...");
TeaBot.startPolling();