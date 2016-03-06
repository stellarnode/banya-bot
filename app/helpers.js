var BanyaUsers = require('./app/models/banyaUsers.js');
var checkUser = require("./app/models/checkUser.js");


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


module.exports.printFrom = printFrom;


function getName(dialog) {
    return dialog.message.from.first_name || dialog.message.from.username;
}

function getCurrentUsers(next) {
    BanyaUsers.find({}, function(err, users) {
        if (err) console.error(err);
        next(users);
    });
}

module.exports.getCurrentUsers = getCurrentUsers;



function userExists(name, next) {
    BanyaUsers.findOne({ $or: [ { 'user.secondName': name }, { 'user.firstName': name } ]}, function(err, user) {
        if (err) console.error(err);
        console.log("--- found this user: ", user.userid, user.user.username, user.user.firstName, user.user.secondName);
        if (next) { next(user); } else return user;
    });
}

module.exports.userExists = userExists;



function prepareTempData(data, user) {
    data.userid = user.userid;
    data.user = {
        firstName: user.user.firstName,
        secondName: user.user.secondName
    };
    return data;
}

module.exports.prepareTempData = prepareTempData;