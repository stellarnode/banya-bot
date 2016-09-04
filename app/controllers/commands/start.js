module.exports = function(name, next) {
    var response = "Здорово, " + name + "!\n\n"
                        + "Я исскуственный интеллект банщика. Понимаю вот что: \n\n"
                        + "\/start - начать диалог \n"
                        + "\/motivateme - получить мотивацию \n"
                        + "\/countdown - сориентировать по времени \n"
                        + "\/setday - назначить день бани \n"
                        + "\/trollme - потроллить себя за несоблюдение традиции \n"
                        + "\/trolluser - потроллить другого\n"
                        + "\/requestfeature - запросить фичу\n"
                        + "\/reportbug - сообщить о баге \n"
                        + "\/cancel - отменить команду\n"
                        + "\/help - попросить помощь\n\n"
                        + "Зови друзей в баню и меня приглашай. Возможно, я буду полезен.\n";
    
    if (next) {
        next(response);
    } else {
        return response;
    }
}