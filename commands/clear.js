const Send = require("../send.js")
const Log = require("../logging.js")
const { DiscordAPIError } = require("discord.js")

async function clear(msg, args, client){
    var cnl = msg.channel
    if(args.length == 2){
        await deleteMessages(cnl, 100)
        return
    }
    if(isNaN(args[2])){
        if(args[2].match(/<@!{0,1}\d+>/)){
            // console.log(args[2])
            // console.log(args[2].substring(args[2].indexOf('<@')+2+(args[2].indexOf('!')==-1?0:1),args[2].indexOf('>')))
            var count = 100
            if(args[3] && !isNaN(args[3])){
                count = parseInt(args[3])
            }
            var user = args[2].substring(args[2].indexOf('<@')+2+(args[2].indexOf('!')==-1?0:1),args[2].indexOf('>'))
            await deleteMessages(cnl, count, client, user, msg)
        }
        return
    }
    if(args.length == 3){
        var cnt = parseInt(args[2])
        if(cnt < 100){
            deleteMessages(cnl, cnt)
            return
        }
        while(cnt > 0){
            if(cnt > 100){
                await deleteMessages(cnl, 100)
                await new Promise(r => setTimeout(r, 1500));
                cnt -= 100
                continue
            }
            await deleteMessages(cnl, cnt)
            cnt = 0
        }
        return
    }
}

async function deleteMessages(cnl, count, client, user, mm){
    if(user){
        var m;
        var username;
        await client.users.fetch(user).then(u => username = u.username).catch(console.error)
        await Send.info(cnl, `Clearing messages from ${username} in the last ${count} messages`).then( message => m = message).catch(console.error)
        var messages
        
        await cnl.messages.fetch({limit: count}).then( mmm => messages = mmm ).catch(console.error)
        
        var msgs = messages.filter( msg => {
            return msg.author.id === user
        })
        
        await cnl.bulkDelete(msgs).then(messages => {
            Log.success(`Bulk deleted ${messages.size} message(s)`)
        }).catch(console.error)
        
        if(user != client.user.id){
            m.delete()
        }
        if(mm.author.id != user){
            mm.delete()
        }
        return
    }
    
    var m;
    await Send.info(cnl, `Clearing ${count} messages`).then( message => {
        m = message
    })
    
    await cnl.bulkDelete(count).then(messages => {
        Log.success(`Bulk deleted ${messages.size} message(s)`)
        return
    }).catch(async (e) => {
        if(e instanceof DiscordAPIError){
            Log.fail("Discord API Error: Deleting over two weeks\nStarting workaround\nTHIS IS VERY SLOW")
        }
        
        var msgs = cnl.messages
        var messages
        await msgs.fetch({limit: count}).then(mmm => messages = mmm).catch(console.error);
        Log.warn(`Received ${messages.size} messages`)
        
        for (message of messages.keys()) {
            await msgs.fetch(message).then( mess => mess.delete()).catch(console.error)
            await new Promise(r => setTimeout(r, 1000))
        }
        Log.Success(`Cleared ${count} messages`)
    })
}

module.exports = clear