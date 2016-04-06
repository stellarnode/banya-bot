var BugReport = require('../../models/bugReports.js');

function reportBug(message, description, next) {
    
    var newId = Date.now();
    
    /* Uncomment this block to clear current database
    BugReport.find({}, function(err, bugs) {
        if (err) console.error(err);
        bugs.forEach(function(el) {
            el.remove(function(err) {
                if (err) console.error(err);
                console.log("= bug entry", el.id, "removed.");
            });
        });
    });
    //*/
    
    //*
    var newBug = new BugReport({
        id: newId,
        reportedBug: description.replace(/\s*\@banya\_bot\s*/, ""),
        reportedBy: {
            userid: message.from.id,
            firstName: message.from.first_name,
    		secondName: message.from.last_name,
    		username: message.from.username,
        },
        createdAt: Date.now()
    });
    
    newBug.save(function(err) {
        if (err) console.error(err);
        console.log("--- saved new bur report from: ", message.from.username, message.from.first_name, message.from.last_name);
        BugReport.find({}, function(err, bugs) {
            if (err) console.error(err);
            console.log("--- current number of reported bugs: ", bugs.length);
            bugs.forEach((el) => {
                console.log("   id:", el.id, " ", el.reportedBug, " - reported by", el.reportedBy.userid, el.reportedBy.username, el.reportedBy.firstName, el.reportedBy.secondName);
            });
            if (next) next(bugs);
        });
    });
    //*/

}

module.exports = reportBug;