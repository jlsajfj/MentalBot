const Send = require("../send.js")
const Log = require("../logging.js")
const { DiscordAPIError } = require("discord.js")
function ping(message){
        const timeTaken = message.createdTimestamp - Date.now();
        message.channel.send(`:ping_pong: ${timeTaken}ms.`);
}

module.exports = ping