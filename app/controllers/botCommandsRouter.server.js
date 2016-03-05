var BanyaUsers = require('../models/banyaUsers.js');
var checkUser = require("../models/checkUser.js");


var start = require("./commands/start.js");
var help = require("./commands/help.js");
var motivateme = require("./commands/motivateme.js");
var trollme = require("./commands/trollme.js");
var trolluser = require("./commands/trolluser.js");


function botCommandsRouter(message) {

    var response;
    var name = message.from.first_name || message.from.username;
    var commandParsed = (/^\//.test(message.text)) ? message.text : "just text";
    
    
    function handleCommands(user, next) {

        switch(commandParsed) {
        
            case "/start":
                response = start(name);
                break;
                
            case "/motivateme":
                response = motivateme();
                console.log("botCommandsRouter motivateme returns: ", response);
                break;
                
            case "/trollme":
                response = trollme(message);
                break;
                
            case "/help":
                response = help(name);
                break;
            
            case "just text":
                // response = name + ", настройся на правильную волну и используй только те команды, которые я понимаю."
                break;
        }
        
        if (next) {
            next(response);
        } else if (commandParsed === "/trollme" && response === undefined) {
            return response; // = "Похоже, ты чист. Но все равно - иди в баню.";
        } else {
            return response;
        }
            
    }
    
    
    function updateUser(user, response) {
        
        BanyaUsers.findOne({ 'userid': user.userid }, function(err, user) {
            if (err) console.error(err);
            if (user) {
                user.previousCommand = commandParsed;
                user.replies.push({ message: response, timestamp: Date.now() });
                user.lastRequest = Date.now();
                
                user.save(function(err) {
                    if (err) console.error(err);
                    console.log(new Date().toISOString(), " User updated: ", user.userid, user.user.username);
                });
            }
        });
        
    }
    
    var startTimer = Date.now();
    
    response = handleCommands();
    checkUser(message, function(user) {
        updateUser(user, response);
    });
    
    console.log("=> botCommandsRouter took: ", Date.now() - startTimer, "ms");
    
    return response;
    
}

module.exports = botCommandsRouter;