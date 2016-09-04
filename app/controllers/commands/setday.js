require('datejs');
var NextBanya = require('../../models/nextBanya.js');

function convertToNumber(nextBanyaDay) {
    
    switch (nextBanyaDay) {
        case "Понедельник":
            return 1;
        case "Вторник":
            return 2;
        case "Среда":
            return 3;
        case "Четверг":
            return 4;
        case "Пятница":
            return 5;
        case "Суббота":
            return 6;
        case "Воскресенье":
            return 0;
        default:
            return 3;
    }
    
}


function setday(nextBanyaDay, chatId, userId, setForDate) {
    
    var nextDay = 3;
    
    if (typeof nextBanyaDay == "string") {
        nextDay = convertToNumber(nextBanyaDay);
    } else if ((typeof nextBanyaDay == "number") && (nextBanyaDay >= 0 && nextBanyaDay <= 6)) {
        nextDay = nextBanyaDay;
    }
    
    console.log("-- setting nextBanyaDay on " + nextBanyaDay + " in chat id " + chatId + ". Requested by user " + userId + ".");
    
    NextBanya.find({chatId: chatId}, function(err, nextBanyaDay) {
        if (err) console.error(err);
        if (nextBanyaDay[0]) {
            console.log("-- currently next Banya Day is " + nextBanyaDay[0].nextDay);
            
            nextBanyaDay[0].nextDay = nextDay;
            
            if (setForDate) {
                nextBanyaDay[0].setFor = setForDate;
            }
            
            if (nextBanyaDay[0].setFor < Date.now()) {
                nextBanyaDay[0].remove(function(err) {
                    if (err) console.error(err);
                    console.log("-- removed entry for the next Banya Day to be 3 (Sreda).");
                });
            } else {
                
                nextBanyaDay[0].save(function(err) {
                    if (err) console.error(err);
                    console.log("-- updating entry to " + nextDay);
                    console.log("-- DONE");
                    NextBanya.findOne({chatId: chatId}, function(err, nextBanyaDay) {
                        if (err) console.error(err);
                        if (nextBanyaDay && nextBanyaDay.nextDay != undefined) {
                            console.log("-- now next Banya Day is " + nextBanyaDay.nextDay);
                        }
                    });
                });
            }
    
            
        } else if (userId) {
            var nextBanyaDay = new NextBanya({
                setByUserId: userId,
            	chatId: chatId,
            	nextDay: nextDay,
            	setOn: Date.now()
            });
            
            if (setForDate) {
                nextBanyaDay.setFor = setForDate;
            }
            
            nextBanyaDay.save(function(err) {
                if (err) console.error(err);
                console.log("-- setting new entry for " + nextDay);
                console.log("-- DONE");
            });
        }
    });
    
}

module.exports = setday;