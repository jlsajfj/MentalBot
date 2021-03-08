const Send = require("../send.js")
const Log = require("../logging.js")
const { DiscordAPIError } = require("discord.js")

function clear(msg, args, client) {
    var cnl = msg.channel
    if (args.length == 2) {
        if (msg.reference) {
            return deleteMessages(cnl, 100, client, null, msg, msg.reference.messageID)
        } else {
            return deleteMessages(cnl, 100)
        }
    }
    if (isNaN(args[2])) {
        if (args[2].match(/<@!{0,1}\d+>/)) {
            var count = 100
            if (args[3] && !isNaN(args[3])) {
                count = parseInt(args[3])
            }
            var user = args[2].substring(args[2].indexOf('<@') + 2 + (args[2].indexOf('!') == -1 ? 0 : 1), args[2].indexOf('>'))
            return deleteMessages(cnl, count, client, user, msg)
        }
    }
    if (args.length == 3) {
        var cnt = parseInt(args[2])
        if (cnt < 100) {
            return deleteMessages(cnl, cnt)
        }
        return deleteMessage(cnl, 100)
    }
}

function deleteMessages(cnl, count, client, user, mm, referencedMessageID) {
    if (user) {
        return new Promise( (done, error) => {
            client.users.fetch(user).then(userObj => {
                Send.info(cnl, `Clearing messages from ${userObj.username} in the last ${count} messages`).then(message => {
                    cnl.messages.fetch({ limit: count }).then(messageSet => {
                        var messagesToDelete = messageSet.filter(msg => msg.author.id === user )
                        
                        cnl.bulkDelete(messagesToDelete).then(deletedMessages => {
                            if (user != client.user.id) {
                                message.delete()
                            }
                            if (mm.author.id != user) {
                                mm.delete()
                            }
                            Log.success(`Bulk deleted ${deletedMessages.size} message(s)`)
                            done(`Bulk deleted ${deletedMessages.size} message(s)`)
                        }).catch(error)
                    }).catch(error)
                }).catch(error)
            }).catch(error)
        })
    }

    if (referencedMessageID) {
        return new Promise( (done, error) => {
            Send.info(cnl, `Clearing messages after replied message, up to 100`).then( () => {
                cnl.messages.fetch({ limit: count }).then(messageSet => {
                    var messageArray = messageSet.array();
                    var foundIndex = -1;
                    for (var i = 0; i < messageArray.length; i++) {
                        if (messageArray[i].id === referencedMessageID) {
                            foundIndex = i;
                            break;
                        }
                    }
                    
                    var messagesToDelete;
                    if(foundIndex === -1){
                        messagesToDelete = messageArray
                    }
                    else{
                        messagesToDelete = messageArray.filter( (msg, index) => index < foundIndex )
                    }
                    
                    cnl.bulkDelete(messagesToDelete).then(deletedMessages => {
                        Log.success(`Bulk deleted ${deletedMessages.size} message(s)`)
                        done(`Bulk deleted ${deletedMessages.size} message(s)`)
                    }).catch(error)
                }).catch(error)
            }).catch(error);
        })
    }
    
    return new Promise( (done, error) => {
        Send.info(cnl, `Clearing ${count} messages`).then( () => {
            cnl.bulkDelete(count).then(deletedMessages => {
                Log.success(`Bulk deleted ${deletedMessages.size} message(s)`)
                done(`Bulk deleted ${deletedMessages.size} message(s)`)
            }).catch(error)
        })
    })

}

module.exports = {
    func: clear,
    init: () => {}
}