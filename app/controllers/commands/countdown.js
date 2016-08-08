require('datejs');

function incrementDate(currentDay) {
	if (currentDay >= 0 && currentDay < 3) return 3 - currentDay;
	if (currentDay == 3) return 3;
	return 7 - currentDay + 3;
}


function describe(tMinus, descriptor) {
  
  var options = [];
  
  switch(descriptor) {
    case "дней":
      options = ["день", "дня", "дней"];
      break;
    case "часов":
      options = ["час", "часа", "часов"];
      break;
    case "минут":
      options = ["минута", "минуты", "минут"];
      break;
    case "секунд":
      options = ["секунда", "секунды", "секунд"];
      break;
  }    
  
  
  if (tMinus >= 11 && tMinus <= 20) {
    return options[2];
  } else if (tMinus % 10 == 1) {
    return options[0];
  } else if (tMinus % 10 > 1 && tMinus % 10 < 5) {
    return options[1];
  } else {
    return options[2];
  }
  
}


module.exports = function() {
  
  // Everything here is based on UTC time; need to change if daylight saving time is introduced again in Russia 
  
  // convert to UTC time
  var now_loc = new Date(); 
  var now = new Date(now_loc.getUTCFullYear(), now_loc.getUTCMonth(), now_loc.getUTCDate(), now_loc.getUTCHours(), now_loc.getUTCMinutes(), now_loc.getUTCSeconds());
  
  var offset = new Date(now).getTimezoneOffset();
  // now = new Date(2016, 7, 9, 23, 32, 41); // testing data
  console.log("-- current data and time in UTC: " + new Date(now).toISOString());
  console.log("-- current data and time in server time zone: " + new Date(now).toString());
  console.log("-- timezone offset UTC: " + offset);
  
  var days = (1000 * 60 * 60 * 24);
  var hours = (60 * 60 * 1000);
  var minutes = (60 * 1000);
  var seconds = 1000;
  
  if (now.getDay() == 3 && now.getHours() >= 16 && now.getHours() <= 19) {
    var start = new Date(now).setHours(16);
    start = new Date(start).setMinutes(0);
    start = new Date(start).setSeconds(0);
    var diff = Math.abs(start - new Date(now));
    var hoursRunning = Math.floor(diff / hours);
    var minutesRunning = Math.floor(((diff - hoursRunning * hours) % hours) / minutes);
    var secondsRunning = Math.floor(((diff - hoursRunning * hours - minutesRunning * minutes) % minutes) / seconds);
    
    var running = [hoursRunning, minutesRunning, secondsRunning];
    var descriptors = running.map(function(el, idx) {
      var temp = describe(el, ["часов", "минут", "секунд"][idx]);
      var out;
      switch (temp) {
        case "минута":
          out = "минуту";
          break;
        case "секунда":
          out = "секунду";
          break;
        default:
          out = temp;
          break;
      }
      return out;
    });
    
    return ("Баня в активной фазе " +
              running[0] + " " + descriptors[0] + " " +
              running[1] + " " + descriptors[1] + " " +
              running[2] + " " + descriptors[2] + ".");
  }

  var next = new Date(now);
  
  if (now.getDay() != 3 || (now.getDay() == 3 && now.getHours() >= 19)) {
    next = next.next().wednesday();
  }

  next = new Date(next).setSeconds(0);
  next = new Date(next).setMinutes(0);
  next = new Date(next).setHours(16); // UTC time is used; need to change if daylight saving time is introduced 
  console.log("-- next data and time in UTC: " + new Date(next).toISOString());
  console.log("-- next data and time in server time zone: " + new Date(next).toString());
  
  var diff = next - new Date(now); // UTC time is used; change if daylight saving time is introduced
  
  var daysLeft = Math.floor(diff / days);
  var hoursLeft = Math.floor((diff % days) / hours);
  var minutesLeft = Math.floor((diff % hours) / minutes);
  var secondsLeft = Math.floor((diff % minutes) / seconds);
  
  var tMinus = [daysLeft, hoursLeft, minutesLeft, secondsLeft];
  var tMinusDescriptors = tMinus.map(function(el, idx) {
    return describe(el, ["дней", "часов", "минут", "секунд"][idx]);
  });
  
  
  // console.log("T minus " + tMinus[0] + ":" + tMinus[1] + ":" + tMinus[2] + ":" + tMinus[3] + " and counting");
  return ("До бани осталось " +
              tMinus[0] + " " + tMinusDescriptors[0] + " " +
              tMinus[1] + " " + tMinusDescriptors[1] + " " +
              tMinus[2] + " " + tMinusDescriptors[2] + " " +
              tMinus[3] + " " + tMinusDescriptors[3] + ".");
}