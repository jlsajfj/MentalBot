const Send = require("../send.js")
const Log = require("../logging.js")
const { readFile, writeFile } = require('fs')

var auto_replies;

function setreply(msg, args){
    if(args.length <  4) return;
    return new Promise( done => {
        auto_replies[args[2]] = args[3]
        writeFile('./auto_replies.json', JSON.stringify(auto_replies, null, 4), (err, data) => {
            if (err) throw err
            Send.success(msg, `Set ${args[2]} = ${args[3]}`)
            done(`Set ${args[2]} = ${args[3]}`)
        })
    })
}

function init(client){
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
}

module.exports = {
    desc: 'Set auto-replies',
    func: setreply,
    init: init
}