const Send = require("../send.js")
const Log = require("../logging.js")
const { readFile, writeFile } = require('fs')

async function setreply(msg, args){
    await readFile('./auto_replies.json', (err, data) => {
        if (err) throw err;
        var auto_replies = JSON.parse(data);
        auto_replies[args[2]]=args[3]
        writeFile('./auto_replies.json', JSON.stringify(auto_replies, null, 4), (err, data) => {
            if (err) throw err;
            Send.success(msg, `Set ${args[2]} = ${args[3]}`)
        })
    });
}

module.exports = setreply