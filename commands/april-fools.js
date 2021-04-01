const Send = require("../send.js")
const Log = require("../logging.js")
const prank = require("./april-fools.json")

function reply(msg){
    return Send.success(msg, "I ran out of insults ok?" )
}

function init(client){
    Log.info('Setting up april-fools')
    client.on("message", msg => {
        if(msg.author.id === client.user.id) return
        if(msg.author.id in prank){
            Log.info(`${msg.author.username} sent the message: ${msg.content}`)
            Send.success(msg, `<@!${msg.author.id}> ${prank[msg.author.id]}`).then( sent_msg => {
                setTimeout(() => {
                    sent_msg.delete()
                    Log.success('Message erased')
                }, 2000)
            }).catch(Log.fail)
            return
        }
    })
    Log.success('Completed')
}

module.exports = {
    name: 'prank',
    desc: 'Set auto-replies',
    func: reply,
    init: init
}