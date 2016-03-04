var path = process.cwd();
var https = require('https');
var botCommands = require(path + '/app/controllers/botCommands.server.js');
var BanyaUsers = require('../models/banyaUsers.js');
var Counter = require('../models/counters.js');

function BotController() {
    
    var counterId;
    
    function buildReqUrl(method, params) {
        var apiEndpoint = process.env.TELEGRAM_API_ENDPOINT;
        var botToken = process.env.BOT_TOKEN;
        var url = apiEndpoint + botToken + method;
        
        if (params) {
            url += '?';
            params.forEach(function(el) {
                url += el[0] + '=' + el[1] + '&';
            });
            url = url.slice(0, -1);
        }
        
        return url;
    }
    
    function sendAPIRequest(url, next) {
        https.get(url, function(res) {
           var body = '';
           res.on('data', function(chunk) {
               body += chunk;
           });
           res.on('end', function() {
               var result = JSON.parse(body);
               result = result.result;
               // console.log(body.result);
               if (result[0] && next) next(result);
           });
        }).on('error', function(err) {
            console.log("Got error: ", err);
        });
    }
    
    function getOffset(next) {
        Counter
			.findOne( { '_id': counterId }, function (err, result) {
				if (err) console.log(err);
                console.log(".getOffset reports => Current offset: ", result.offset, " Current counter: ", result.counter);
				next(result.offset + 1);
				});
    }
    
    function setOffset(newOffset) {
        Counter
			.findOne({ '_id': counterId }, function (err, result) {
			    if (err) console.error(err);
			    result.counter += 1;
			    result.offset = newOffset;
			    
			    result.save(function(err) {
			        if (err) console.error(err);
			        console.log("New offset set: ", result.offset);
			    });
			});
    }
    
    function handleUpdates(result) {
        
        // console.log("telegram api response object 'message.from.id': \n", result[0].message.from.id);
        
        for (var i = 0; i < result.length; i++) {
            setOffset(result[i].update_id);
            // console.log("Getting response for: ", result[i].message.chat, result[i].message.text);
            var response = botCommands(result[i].message.chat, result[i].message.text, result[i].message.from.id);
            sendBotMessage(result[i].message.chat.id, response);
        }
        
    }
    
    function handleCommands() {
        
    };
    
    function handleResponses() {
        
    };
    
    function sendBotMessage(chat, message) {
        var url = buildReqUrl('/sendMessage', [['chat_id', chat], ['text', encodeURIComponent(message)]]);
        sendAPIRequest(url, function() {
            // console.log('sent message: ', message);
        });
    };
    
    this.getUpdates = function() {
        getOffset(function(offset) {
            var url = buildReqUrl('/getUpdates', [['offset', offset]]);
            sendAPIRequest(url, handleUpdates);
        });
    };
    
    
    this.startCounter = function(next) {
        
        Counter.find({}, function(err, counter) {
            if (err) console.error(err);
            
            console.log("current counter obj length: ", counter.length);
            console.log("counter obj: \n", counter);
            
            
            /* Uncomment this block to delete all previous counters
            for (var i = counter.length - 1; i >= 0; i--) {
                counter[i].remove(function(err) {
                    if (err) console.error(err);
                    console.log("counter ", i, " removed. Current length: ", counter.length);
                });
            }
            //*/
            
            
            //* Uncomment this block to create new counters
            
            if (counter.length === 0) {
                
                var newCounter = new Counter({
				    counter: 0,
				    offset: 0
				});
				
                newCounter.save(function (err) {
        			if (err) console.error(err);
        			console.log("New counter started. Counter: ", newCounter.counter, " Offset: ", newCounter.offset);
        			
        			Counter.find({}, function(err, counter) {
        			    if (err) console.error(err);
        			    console.log("Saved counter: ", counter);
        			    console.log("Saved counter ID: ", counter[0]._id);
        			    counterId = counter[0]._id;
        			    if (next) next(counterId);
        			});
        			
        		});
	
            } else {
                console.log("Printed by .startCounter =>");
                console.log("Current counter: \n", counter);
                console.log("Current count: ", counter[0].counter, " Current offset: ", counter[0].offset);
                counterId = counter[0]._id;
        	    if (next) next(counterId);
            }
            
            //*/
            
            
        });

	}
    
}


module.exports = BotController;

