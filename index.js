'use strict';

var util = require("util");
var mongoose = require('mongoose');
var path = process.cwd();
require('dotenv').load();
var bodyParser = require('body-parser');
var app = require('express')();

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
var countdown = require("./app/controllers/commands/countdown.js");
var setday = require("./app/controllers/commands/setday.js");

var TeaBot = require("teabot")(process.env.BOT_TOKEN, process.env.BOT_NAME.toLowerCase());
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
        if (user) {
            console.log("--- found this user: ", user.userid, user.user.username, user.user.firstName, user.user.secondName);   
        }
        if (next) { next(user); } else return user;
    });
}

function prepareTempData(tempData, user) {
    var data = {};
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
    
    .defineCommand('/countdown', function (dialog) {
        printFrom(dialog);
        countdown(dialog.chatId, function(message) {
            console.log(message);
            dialog
              .setKeyboard()
              .sendMessage(message);
        });
    })
    
    .defineCommand('/setday', function(dialog) {
        printFrom(dialog);
        var keyboard = [["Понедельник", "Вторник"], ["Среда", "Четверг"], ["Пятница", "Суббота"], ["Воскресенье"]];
        dialog.startAction('/setday');
        dialog
            .setKeyboard(keyboard, true, true)
            .sendMessage("На какой день договорились про следующую баню?");
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
                if (el.userid != 170522191) {
                    keyboard.push(new Array((el.user.secondName) ? el.user.firstName + " " + el.user.secondName : el.user.firstName));
                }
            });
            keyboard.push(['другого']);
            keyboard.push(['/cancel']);
            
            dialog.setKeyboard(keyboard, true, true);
            dialog.sendMessage("Кого ты хочешь потроллить (скролл работает, если что)?");
        });
        
    })
    
    .defineCommand('/requestfeature', function (dialog) {
        printFrom(dialog);
        dialog.startAction('/requestfeature').sendMessage("Опиши предлагаемую фичу. Только коротко. " + "Начинай ответ с '/ ', чтобы я понял.");
    })
    
    .defineCommand('/reportbug', function (dialog) {
        printFrom(dialog);
        dialog.startAction('/reportbug').sendMessage("Опиши найденную ошибку. Только коротко. " + "Начинай ответ с '/ ', чтобы я понял.");
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
        var command = dialog.message.command;
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
    
    .defineAction('/setday', function(dialog, message) {
        var nextBanyaDay = message.getArgument();
        setday(nextBanyaDay, dialog.chatId, dialog.userId);
        dialog
            .endAction(true)
            .setKeyboard()
            .sendMessage('Раз так договорились, хорошо.');
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
                        .sendMessage("Пиши фразу, чтобы добавить в его копилку. Когда он будет себя троллить, она будет выбираться случайным образом среди других. "
                            + "Начинай ответ с '/ ', чтобы я понял.");

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
                    .sendMessage("Пиши фразу, чтобы добавить в его копилку. Когда он будет себя троллить, она будет выбираться случайным образом среди других. "
                        + "Начинай ответ с '/ ', чтобы я понял.");
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
        console.log("--- contact received: \n", message.contact);
        
        var data = dialog.getTempData('data') || {};
        
        if (!message.contact.user_id) {
            dialog
                .endAction()
                .setKeyboard()
                .sendMessage("Похоже, этого персонажа в Телеграме нет, спроси его напрямую сам.");
        } else {
            trolluser.addUserFromContact(message.contact, function(user) {
                if (user) {
                    data = prepareTempData(data, user);
                    dialog.setTempData('data', data);
                    dialog
                        .endAction(true)
                        .setKeyboard()
                        .startAction('/trolluser:phrase')
                        .sendMessage("Контакт запомнил. Пиши теперь фразу, чтобы добавить в его копилку. "
                            + "Когда он будет себя троллить, она будет выбираться случайным образом среди других. "
                            + "Начинай ответ с '/ ', чтобы я понял.");
                } else {
                    dialog
                        .endAction()
                        .setKeyboard()
                        .sendMessage("Что-то пошло не так. Сложный юзер. Не смог запомнить.");
                }
                
            });
        }
        
    });
    


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());


 
console.log(new Date().toISOString(), "BANYA BOT PROUDLY STARTED...");

// Environment settings for OpenShift and Heroku deployment

if (process.env.OPENSHIFT_NODEJS_PORT) {
    var port = process.env.OPENSHIFT_NODEJS_PORT;
} else {
    var port = process.env.PORT || 8080;
}

if (process.env.OPENSHIFT_NODEJS_IP || process.env.IP) {
    var ip_address = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
}


if (ip_address) {
    app.listen(port, ip_address, function () {
    	console.log('Node.js listening on port ' + port + ' and ip address ' + ip_address + '...');
    });
} else {
    app.listen(port, function () {
    	console.log('Node.js listening on port ' + port + '...');
    });
}


// Uncomment TeaBot.startPolling() and comment TeaBot.setWebhook
// to use polling method instead.

if (process.env.OPENSHIFT_GEAR_DNS) {
    
    // Webhook option
    console.log("...AND USING WEBHOOK ON OPENSHIFT.");
    TeaBot.setWebhook('https://' + process.env.OPENSHIFT_GEAR_DNS + '/AAHaCgMCHBKK3Cy7UmI5TTBSrX4zGGpLv50');
    
    app.post('/AAHaCgMCHBKK3Cy7UmI5TTBSrX4zGGpLv50', function (req, res) {
      var message = req.body || false;
      console.log('...got a message...');
      if (message) {
        TeaBot.receive(message);
      }
    
      res.status(200).end();
    });

} else if (process.env.APP_URL === "https://banya-bot-stellarnode.c9users.io/") {
    
    // Webhook TEST option
    console.log("...AND USING WEBHOOK ON C9.io.");
    TeaBot.setWebhook(process.env.APP_URL + 'AAHaCgMCHBKK3Cy7UmI5TTBSrX4zGGpLv50');
    
    app.post('/AAHaCgMCHBKK3Cy7UmI5TTBSrX4zGGpLv50', function (req, res) {
      var message = req.body || false;
      // console.log('...got a message...');
      // console.log(req.body);
      if (message) {
        TeaBot.receive(message);
      }
    
      res.status(200).end();
    });
    
} else {
    
    // getUpdate polling option if not on OpenShift
    console.log("...AND USING POLLING.");
    TeaBot.startPolling();
}