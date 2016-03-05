var motivations = require('../models/motivations.js');
var banyaUsers = require('../models/banyaUsers.js');
var trollPhrases = require('../models/trollPhrasesStart.js');

function checkUser(message, next) {
    banyaUsers.findOne({ "userid": message.from.id }, function(err, user){
        if (err) console.error(err);
        if (user) {
            console.log("--- user exists: ", user.userid, user.user.username);
            if (next) next(user);
        } else {
            var newUser = new banyaUsers({
                userid: message.from.id,
                user: {
                    firstName: message.from.first_name,
                    secondName: message.from.last_name,
                    username: message.from.username
                },
                previousCommand: message.text,
                replies: [],
                trollPhrases: trollPhrases[message.from.last_name] || [],
                createdAt: Date.now(),
                lastRequest: Date.now()
            });
            
            newUser.save(function(err) {
                if (err) console.error(err);
                console.log("--- new banya user created: ", message.from.id, message.from.username);
                banyaUsers.findOne({ "userid": message.from.id }, function(err, user) {
                    if (err) console.error(err);
                    if (next) next(user);
                });
            });
        }
        
    });
}
    
module.exports = checkUser;