var FeatureRequest = require('../../models/featureRequests.js');

function featureRequest(message, description, next) {
    
    var newId = Date.now();
    
    /* Uncomment this block to clear current database
    FeatureRequest.find({}, function(err, features) {
        if (err) console.error(err);
        features.forEach(function(el) {
            el.remove(function(err) {
                if (err) console.error(err);
                console.log("= entry", el.id, "removed.");
            });
        });
    });
    //*/
    
    //*
    var newFeature = new FeatureRequest({
        id: newId,
        requestedFeature: description,
        proposedBy: {
            userid: message.from.id,
            firstName: message.from.first_name,
    		secondName: message.from.last_name,
    		username: message.from.username,
        },
        createdAt: Date.now()
    });
    
    newFeature.save(function(err) {
        if (err) console.error(err);
        console.log("--- saved new feature request from: ", message.from.username);
        FeatureRequest.find({}, function(err, features) {
            if (err) console.error(err);
            console.log("--- current number of proposed features: ", features.length);
            features.forEach((el) => {
                console.log("   id:", el.id, " ", el.requestedFeature, " - proposed by", el.proposedBy.firstName, el.proposedBy.userid);
            });
            if (next) next(features);
        });
    });
    //*/

}

module.exports = featureRequest;