var path = process.cwd();
var https = require('https');
var botCommands = require(path + '/app/controllers/botCommands.server.js');
var FortuneUsers = require('../models/fortuneUsers.js');
var Counters = require('../models/counters.js');

function BotController() {
    
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
               console.log(body.result);
               next(result);
           });
        }).on('error', function(err) {
            console.log("Got error: ", err);
        });
    }
    
    function getOffset() {
        Counters
			.find({})
			.exec(function (err, result) {
				if (err) { console.log(err); }

				return result.offset;
			});
    }
    
    function setOffset(newOffset) {
        Counters
			.findOneAndUpdate({}, { $inc: { 'counter': 1 } }, { $set: { 'offset': newOffset } })
			.exec(function (err, result) {
					if (err) { console.log(err); }
					return;
				}
			);
    }
    
    function handleUpdates(result) {
        
        for (var i = 0; i < result.length; i++) {
            setOffset(result[i].update_id);
            // console.log("Getting response for: ", result[i].message.chat, result[i].message.text);
            var response = botCommands(result[i].message.chat, result[i].message.text);
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
        var offset = getOffset();
        var url = buildReqUrl('/getUpdates', [['offset', offset]]);
        sendAPIRequest(url, handleUpdates);
    };
    
}


module.exports = BotController;

