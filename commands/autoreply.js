const Send = require("../send.js")
const Log = require("../logging.js")
const { readFile, writeFile } = require('fs')

var auto_replies;

function setreply(msg, args){
    if(args.length <  4) return Send.fail(msg, 'Not enough arguments')
    return new Promise( (done, error) => {
        auto_replies[args[2]] = args[3]
        writeFile('./auto_replies.json', JSON.stringify(auto_replies, null, 4), (err, data) => {
            if (err) error(err)
            else Send.success(msg, `Set ${args[2]} = ${args[3]}`).then(done).catch(error)
        })
    })
}

function init(client){
    Log.info('Setting up auto-replies')
    readFile('./auto_replies.json', (err, data) => {
        if (err){
            Log.fail("auto_replies.json has an issue.")
            Log.fail(err.stack)
        }
        else {
            auto_replies = JSON.parse(data);
        }
    })
    client.on("message", msg => {
        if(msg.author.id === client.user.id) return
        if(msg.content in auto_replies){
            Log.info(`${msg.author.username} sent the message: ${msg.content}`)
            Send.success(msg, auto_replies[msg.content])
            return
        }
    })
    Log.success('Completed')
}

module.exports = {
    desc: 'Set auto-replies',
    func: setreply,
    init: init
}