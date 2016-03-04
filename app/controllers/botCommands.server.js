var motivations = require('../models/motivations.js');
var banyaUsers = require('../models/banyaUsers.js');
var trollPhrases = require('../models/trollPhrasesStart.js');

function botCommands(chat, command, fromId) {

    var response;
    var name = chat.first_name || chat.username;
    var commandParsed = (/^\//.test(command)) ? command : "just text";
    
    
    
    
    switch(commandParsed) {
        
        case "/start":
            response = "Добрый день, " + name + "!\n\n"
                        + "Тебя приветствует исскуственный интеллект банщика. Я понимаю такие команды: \n\n"
                        + "\/start - начало диалога со мной \n"
                        + "\/motivateme - получить мотивацию \n"
                        + "\/trollme - потроллить себя за несоблюдение традиции \n"
                        // + "\/trolluser - потроллить другого юзера, формат команды: \/trolluser \<@user\> \<фраза-для-троллинга\>. Фраза будет добавлена в каталог троллинговых фраз для указанного юзера.\n"
                        + "\/help - помощь\n\n"
                        + "Можешь отправить ссылку на меня своим друзьям. Возможно, им я буду полезен.\n";
            break;
            
        case "/motivateme":
            var selection = Math.floor(Math.random() * motivations.length);
            response = motivations[selection];
            break;
            
        case "/trollme":

            break;
            
        case "/help":
            response = "Напоминаю, " + name + ", что обратиться ко мне можно так: \n\n"
                        + "\/start - начало диалога со мной \n"
                        + "\/motivateme - узнать свое будущее \n"
                        + "\/trollme - потроллить себя за несоблюдение традиции \n"
                        // + "\/trolluser - потроллить другого юзера, формат команды: \/trolluser \<@user\> \<фраза-для-троллинга\>. Фраза будет добавлена в каталог троллинговых фраз для указанного юзера.\n"
                        + "\/help - помощь\n\n";
            break;
        
        case "just text":
            // response = name + ", настройся на правильную волну и используй только те команды, которые я понимаю."
            break;
    }
    
    return response;
}

module.exports = botCommands;