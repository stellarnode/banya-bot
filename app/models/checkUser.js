var motivations = require('../models/motivations.js');
var banyaUsers = require('../models/banyaUsers.js');
var trollPhrases = require('../models/trollPhrasesStart.js');

function checkUser(message, next) {
    
    /* Uncomment this if you want to clear the database from tests
    banyaUsers.find({}, function(err, users) {
        if (err) console.error(err);
        users.forEach((el) => {
            el.remove((err) => {
                if (err) console.error(err);
                console.log("   id: ", el.userid, " user removed.");
            });
            banyaUsers.find({}, (err, users) => {
                if (err) console.error(err);
                console.log("   Current users: ", users.length);
            });
        });
    });
    //*/
    
    
    //*
    banyaUsers.findOne({ "userid": message.from.id }, function(err, user){
        if (err) console.error(err);
        if (user) {
            console.log("--- user exists: ", user.userid, user.user.username, user.user.firstName, user.user.secondName);
            console.log("--- user troll phrases: ", user.trollPhrases);
            if (next) next(user);
        } else {
            var newUser = new banyaUsers({
                userid: message.from.id,
                user: {
                    firstName: message.from.first_name,
                    secondName: message.from.last_name,
                    username: message.from.username,
                    phoneNumber: message.from.phone_number
                },
                previousCommand: message.text,
                replies: [],
                trollPhrases: trollPhrases[message.from.id] || trollPhrases[message.from.last_name] || [],
                createdAt: Date.now(),
                lastRequest: Date.now()
            });
            
            newUser.save(function(err) {
                if (err) console.error(err);
                console.log("--- new banya user created: ", message.from.id, message.from.username, message.from.first_name, message.from.last_name);
                banyaUsers.findOne({ "userid": message.from.id }, function(err, user) {
                    if (err) console.error(err);
                    if (next) next(user);
                });
            });
        }
    });
    //*/
    
}
    
module.exports = checkUser;