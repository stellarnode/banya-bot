module.exports = function(name) {
    var response = "Напоминаю, " + name + ", обращайся ко мне так: \n\n"
                        + "\/start - начать диалог \n"
                        + "\/motivateme - получить мотивацию для бани \n"
                        + "\/trollme - потроллить себя за несоблюдение традиции \n"
                        + "\/trolluser - потроллить другого юзера\n"
                        + "\/requestfeature - запросить новый пар \n"
                        + "\/reportbug - сообщить о баге \n"
                        + "\/cancel - отменить команду\n"
                        + "\/help - попросить помощь\n\n";
    return response;
}