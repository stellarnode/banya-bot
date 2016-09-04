module.exports = function(name) {
    var response = "Напоминаю, " + name + ", обращайся ко мне так: \n\n"
                        + "\/start - начать диалог \n"
                        + "\/motivateme - получить мотивацию \n"
                        + "\/countdown - сориентировать по времени \n"
                        + "\/setday - назначить день бани \n"
                        + "\/trollme - потроллить себя за несоблюдение традиции \n"
                        + "\/trolluser - потроллить другого\n"
                        + "\/requestfeature - запросить фичу\n"
                        + "\/reportbug - сообщить о баге \n"
                        + "\/cancel - отменить команду\n"
                        + "\/help - попросить помощь\n\n";
    return response;
}