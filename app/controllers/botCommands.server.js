var futures = require('../models/futures.js');

function botCommands(chat, command) {

    var response;
    var name = chat.first_name || chat.username;
    
    switch(command) {
        
        case "/start":
            response = "Добрый день, " + name + "!\n\n"
                        + "Только в предраздничные дни я готов показать тебе твое будущее. "
                        + "Обращаться ко мне можно только раз в день. \n\n"
                        + "Я буду реагировать только на следующие твои команды: \n\n"
                        + "\/start - начало диалога со мной \n"
                        + "\/tellme - узнать свое будущее \n"
                        + "\/help - помощь\n\n"
                        + "Можешь отправить ссылку на меня своим коллегам. Возможно, им я буду тоже полезен.\n\n"
                        + "Напиши \/tellme, если ты действительно хочешь узнать о своем будущем.";
            break;
            
        case "/tellme":
            var selection = Math.floor(Math.random() * futures.length) + 1;
            response = futures[selection];
            break;
            
        case "/help":
            response = "Добрый день, " + name + "!\n\n"
                        + "Только в предраздничные дни я готов показать тебе твое будущее. "
                        + "Обращаться ко мне можно раз в день. \n\n"
                        + "Я буду реагировать только на следующие твои команды: \n\n"
                        + "\/start - начало диалога со мной \n"
                        + "\/tellme - узнать свое будущее \n"
                        + "\/help - помощь\n\n"
                        + "Можешь отправить ссылку на меня своим коллегам. Возможно, им я буду тоже полезен.\n\n"
                        + "Напиши \/tellme, если ты действительно хочешь узнать о своем будущем.";
            break;
        
        default:
            response = name + ", настройся на правильную волну и используй только те команды, которые я понимаю."
    }
    
    return response;
}

module.exports = botCommands;