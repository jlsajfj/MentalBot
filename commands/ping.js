const Send = require("../send.js")
const Log = require("../logging.js")

function ping(message){
        const timeTaken = message.createdTimestamp - Date.now();
        Send.success(message, `:ping_pong: ${timeTaken}ms.`);
}

module.exports = ping