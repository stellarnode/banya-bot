module.exports = function() {
    var now = new Date();
    // console.log(now.toISOString());
    var offset = now.getTimezoneOffset();
    var next = new Date(now).setSeconds(0);
    next = new Date(next).setDate(now.getDate() + 7 - now.getDay() + 3);
    next = new Date(next).setMinutes(0);
    next = new Date(next).setHours(19 - 180 / 60);
    // console.log(new Date(next).toISOString());
    
    var diff = next - Date.now() - offset * 60 * 1000;
    
    var days = (1000 * 60 * 60 * 24);
    var hours = (60 * 60 * 1000);
    var minutes = (60 * 1000);
    var seconds = 1000;
    
    var daysLeft = Math.floor(diff / days);
    var hoursLeft = Math.floor(((diff - daysLeft * days) % days) / hours);
    var minutesLeft = Math.floor(((diff - daysLeft * days - hoursLeft * hours) % hours) / minutes);
    var secondsLeft = Math.floor(((diff - daysLeft * days - hoursLeft * hours - minutesLeft * minutes) % minutes) / seconds);
    
    var tMinus = [daysLeft, hoursLeft, minutesLeft, secondsLeft];
    
    tMinus.forEach(function(el) {
      return (el < 10) ? "0" + el : el;
    });
    
    var tMinusDescriptors = ["дней", "часов", "минут", "секунд"];
    
    tMinusDescriptors[0] = (tMinus[0] % 10 == 1) ? "день" : "дней";
    tMinusDescriptors[0] = (tMinus[0] > 1 && tMinus[0] <= 4 && tMinus[0] % 10 != 1) ? "дня" : tMinusDescriptors[0];
    tMinusDescriptors[1] = (tMinus[1] % 10 == 1) ? "час" : "часов";
    tMinusDescriptors[1] = (tMinus[1] % 10 > 1 && tMinus[1] % 10 <= 4 && tMinus[1] % 10 != 1) ? "часа" : tMinusDescriptors[1];
    tMinusDescriptors[2] = (tMinus[2] % 10 == 1) ? "минута" : "минут";
    tMinusDescriptors[2] = (tMinus[2] % 10 > 1 && tMinus[2] % 10 <= 4 && tMinus[2] % 10 != 1) ? "минуты" : tMinusDescriptors[2];
    tMinusDescriptors[3] = (tMinus[3] % 10 == 1) ? "секунда" : "секунд";
    tMinusDescriptors[3] = (tMinus[3] % 10 > 1 && tMinus[3] % 10 <= 4 && tMinus[3] % 10 != 1) ? "секунды" : tMinusDescriptors[3];
    
    
    // console.log("T minus " + tMinus[0] + ":" + tMinus[1] + ":" + tMinus[2] + ":" + tMinus[3] + " and counting");
    return ("До бани осталось " +
                tMinus[0] + " " + tMinusDescriptors[0] + " " +
                tMinus[1] + " " + tMinusDescriptors[1] + " " +
                tMinus[2] + " " + tMinusDescriptors[2] + " " +
                tMinus[3] + " " + tMinusDescriptors[3] + ".");
}