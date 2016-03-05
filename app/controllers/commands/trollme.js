var trollPhrases = require('../../models/trollPhrasesStart.js');
var checkUser = require("../../models/checkUser.js");

module.exports = function(message, next) {
    var response;
    
    var startTime = Date.now();
    
    checkUser(message, function(user) {
                    if (user.trollPhrases) {
                        response = user.trollPhrases[Math.floor(Math.random() * user.trollPhrases.length)];
                    } else {
                        response = "Похоже, ты чист. Но все равно - иди в баню.";
                    }
                    console.log("--- trollme returns: ", response);
                    console.log("--- trollme process took: ", Date.now() - startTime, "ms");
                    
                    if (next) {
                        next(response);
                    } else {
                        return response;
                    }
                    
                });

}