const { TextChannel, GuildMember } = require("discord.js")
const Log = require("./logging.js")

function sendSuccess(recv, msg){
    return sendMain(recv, msg, Log.success)
}

function sendFail(recv, msg){
    return sendMain(recv, msg, Log.fail)
}

function sendInfo(recv, msg){
    return sendMain(recv, msg, Log.info)
}

function sendColor(recv, msg, color){
    return sendMain(recv, msg, Log.color, color)
}

function sendMain(recv, msg, log_func, color){
    return new Promise( (done, error) => {
        if(recv instanceof TextChannel){
            recv.send(msg)
                    .then(message => {
                        log_func(`Sent message: ${message.content}`, color)
                        done(message);
                    })
                    .catch(error);
        }
        else{
            recv.channel.send(msg)
                    .then(message => {
                        log_func(`Sent message: ${message.content}`, color)
                        done(message);
                    })
                    .catch(error);
        }
    });
}

module.exports = {
    success: sendSuccess,
    fail: sendFail,
    info: sendInfo,
    color: sendColor
}