var BanyaUsers = require('../../models/banyaUsers.js');
var checkUser = require("../../models/checkUser.js");

function trollUser(data, next) {
    console.log("--- trolluser called --- ");
    console.log(" data passed to it: \n", data);
}

module.exports.trollUser = trollUser;



function addUserFromContact(contact, next) {
    var message = {};
    message.from = {
        id: contact.user_id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        phone_number: contact.phone_number,
        username: contact.username
    };
    
    checkUser(message, function(user) {
        if (next && user) {
            next(user);
        } else {
            console.log("--- something went wrong when creating user: ", message.from.first_name, message.from.last_name);
        }
    });
    
}

module.exports.addUserFromContact = addUserFromContact;


function addTrollPhrase(data, next) {
    console.log("--- got this as inputs for adding troll phrase... user: ", data.user, " phrase: ", data.phrase);
    
    BanyaUsers.findOne({ 'userid': data.userid }, function(err, user) {
        if (err) console.error(err);
        
        if (!user) {
            console.log("--- something went wrong when updating user: ", data.userid, data.user.firstName, data.user.secondName, " with phrase ", data.phrase);
            return;
        }
        
        user.trollPhrases.push(data.phrase.replace(/\s*\@banya\_bot\s*/, ""));
        user.save(function(err) {
            if (err) console.error(err);
            console.log("--- updated user ", user.user.firstName, user.user.secondName, " with troll phrase: ", data.phrase);
            if (next) {
                next(user);
            } else {
                return user;
            }
        });
    });
}

module.exports.addTrollPhrase = addTrollPhrase;