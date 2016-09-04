var NextBanya = require('../models/nextBanya.js');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

function getNextBanyaDay(chatId, next, done) {
    
    var out = 3;
    
    if (!chatId && next) next(out, chatId, done);
    
    NextBanya.find({chatId: chatId}, function(err, nextBanyaDay) {
        if (err) console.error(err);
        if (nextBanyaDay[0] && nextBanyaDay[0].nextDay != undefined) {
            console.log("-- next Banya Day is " + nextBanyaDay[0].nextDay);
            out = nextBanyaDay[0].nextDay;
            if (next) next(out, chatId, done);
            return out;
        } else {
            if (next) next(out, chatId, done);
            return out;
        }
    });

}

module.exports = getNextBanyaDay;