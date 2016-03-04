var motivations = require('../models/motivations.js');
var banyaUsers = require('../models/banyaUsers.js');
var trollPhrases = require('../models/trollPhrasesStart.js');

function checkUser(chat, fromId, next) {
    banyaUsers.findOne({ "userid": fromId }, function(err, user){
        if (err) console.error(err);
        if (user) {
            console.log("--- user exists: ", user.userid, user.user.username);
            if (next) next(user);
        } else {
            var newUser = new banyaUsers({
                userid: fromId,
                user: {
                    firstName: chat.first_name,
                    secondName: chat.last_name,
                    username: chat.username
                },
                replies: [],
                trollPhrases: [],
                createdAt: Date.now(),
                lastRequest: Date.now()
            });
            
            newUser.save(function(err) {
                if (err) console.error(err);
                console.log("--- new banya user created: ", fromId, chat.username);
                banyaUsers.findOne({ "userid": fromId }, function(err, user) {
                    if (err) console.error(err);
                    if (next) next(user);
                });
            });
        }
        
    });
}
    
module.exports = checkUser;