const { TextChannel, GuildMember } = require("discord.js")
const Log = require("./logging.js")

function sendSuccess(recv, msg){
    return new Promise( (done, error) => {
        if(recv instanceof TextChannel || recv instanceof GuildMember){
            recv.send(msg)
                    .then(message => {
                        Log.success(`Sent message: ${message.content}`)
                        done(message);
                    })
                    .catch(error);
        }
        else{
            recv.channel.send(msg)
                    .then(message => {
                        Log.success(`Sent message: ${message.content}`)
                        done(message);
                    })
                    .catch(error);
        }
    });
}

function sendFail(recv, msg){
    return new Promise( (done, error) => {
        if(recv instanceof TextChannel){
            recv.send(msg)
                    .then(message => {
                        Log.fail(`Sent message: ${message.content}`)
                        done(message);
                    })
                    .catch(error);
        }
        else{
            recv.channel.send(msg)
                    .then(message => {
                        Log.fail(`Sent message: ${message.content}`)
                        done(message);
                    })
                    .catch(error);
        }
    });
}

function sendInfo(recv, msg){
    return new Promise( (done, error) => {
        if(recv instanceof TextChannel){
            recv.send(msg)
                    .then(message => {
                        Log.info(`Sent message: ${message.content}`)
                        done(message);
                    })
                    .catch(error);
        }
        else{
            recv.channel.send(msg)
                    .then(message => {
                        Log.info(`Sent message: ${message.content}`)
                        done(message);
                    })
                    .catch(error);
        }
    });
}

function sendColor(recv, msg, color){
    return new Promise( (done, error) => {
        if(recv instanceof TextChannel){
            recv.send(msg)
                    .then(message => {
                        Log.color(`Sent message: ${message.content}`, color)
                        done(message);
                    })
                    .catch(error);
        }
        else{
            recv.channel.send(msg)
                    .then(message => {
                        Log.color(`Sent message: ${message.content}`, color)
                        done(message);
                    })
                    .catch(error);
        }
    });
}

function send(recv, msg, type, color){
}

module.exports = {
    success: sendSuccess,
    fail: sendFail,
    info: sendInfo,
    color: sendColor
}