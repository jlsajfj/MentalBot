const { TextChannel, GuildMember, MessageEmbed } = require("discord.js")
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
        var send_to;
        if(recv instanceof TextChannel || recv instanceof GuildMember){
            send_to = recv;
        }
        else{
            send_to = recv.channel;
        }
        send_to.send(msg)
            .then(message => {
                if(msg instanceof MessageEmbed){
                    log_func(`Sent embed`, color)
                } else {
                    log_func(`Sent message: ${message.content}`, color)
                }
                done(message);
            })
            .catch(error);
    });
}

module.exports = {
    success: sendSuccess,
    fail: sendFail,
    info: sendInfo,
    color: sendColor
}