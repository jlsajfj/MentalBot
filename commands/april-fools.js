const Send = require("../send.js")
const Log = require("../logging.js")
const prank = require("april-fools.json")

function init(client){
    Log.info('Setting up april-fools')
    client.on("message", msg => {
        if(msg.author.id === client.user.id) return
        if(msg.author.id in prank){
            Log.info(`${msg.author.username} sent the message: ${msg.content}`)
            Send.success(msg, prank[msg.author.id])
            return
        }
    })
    Log.success('Completed')
}

module.exports = {
    desc: 'Set auto-replies',
    func: () => {},
    init: init
}