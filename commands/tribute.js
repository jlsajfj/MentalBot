const Send = require("../send.js")
const Log = require("../logging.js")
const { readFile, writeFile } = require('fs')

async function tribute(msg, args){
    await readFile('./tributes.json', async (err, data) => {
        var tributes;
        if (err) {
            tributes = {};
        }
        else {
            tributes = JSON.parse(data);
        }
        Log.info(args)
        if(args.length === 2){
            var id = msg.author.id;
            var val = tributes[id];
            if(val === undefined)
                val = 0;
            val++;
            tributes[id] = val;
            writeFile('./tributes.json', JSON.stringify(tributes, null, 4), (err, data) => {
                if (err) throw err;
                Send.success(msg, `+1 prayer\n${msg.author.username}, you have ${val} prayer!`)
            })
            return
        }
        if(args.length === 3){
            if(args[2] === 'top'){
                var max = 0
                var topu = []
                for (const [key, value] of Object.entries(tributes)) {
                    if(value > max){
                        topu = [key]
                        max = value
                    }
                    else if (value === max){
                        topu.push(key)
                    }
                }
                Send.success(msg, `The highest prayer is ${max}, from:`)
                for(user of topu){
                    await msg.channel.members.fetch(user).then(user => {
                        Send.success(msg,`${user.user.username}`)
                    }).catch(console.error)
                }
            }
        }
    });
}

module.exports = tribute