var motivations = require('../../models/motivations.js');

module.exports = function() {
    var selection = Math.floor(Math.random() * motivations.length);
    var response = motivations[selection];
    console.log("--- motivateme returns: ", response);
    return response;
}