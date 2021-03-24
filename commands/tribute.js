const Send = require("../send.js")
const Log = require("../logging.js")
const { readFile, writeFile } = require('fs')
const { MessageEmbed } = require('discord.js')

function tribute(msg, args){
    return new Promise( (done, error) => {
        readFile('./tributes.json', err, in_data => {
            if (err) error(err)
            else {
                var tributes = JSON.parse(in_data);
                
                if(args.length === 2){
                    var id = msg.author.id;
                    var val = tributes[id];
                    if(val === undefined)
                        val = 0;
                    val++;
                    tributes[id] = val;
                    writeFile('./tributes.json', JSON.stringify(tributes, null, 4), (err, data) => {
                        if (err) error(err)
                        const prayer_embed = new MessageEmbed()
                            .setColor('#FFECAC')
                            .setTitle('Tribute')
                            .setDescription(`+1 prayer\n<@${id}>, you have ${val} prayer!`)
                            .attachFiles(['./assets/hands.png'])
                            .setThumbnail('attachment://hands.png')
                        Send.success(msg, prayer_embed).then(done).catch(error)
                    })
                } else if(args.length === 3){
                    if(args[2] === 'top'){
                        var max = 0
                        var top_users = []
                        for (const [key, value] of Object.entries(tributes)) {
                            if(value > max){
                                top_users = [key]
                                max = value
                            }
                            else if (value === max){
                                top_users.push(key)
                            }
                        }
                        const prayer_embed = new MessageEmbed()
                            .setColor('#FFECAC')
                            .setTitle('Tribute')
                            .attachFiles(['./assets/hands.png'])
                            .setThumbnail('attachment://hands.png')
                            .setDescription(`The highest prayer is ${max}, from:\n<@${top_users.join('>\n<@')}>`)
                        Send.success(msg, prayer_embed).then(done).catch(error)
                    }
                } else Send.fail(msg, 'Invalid number of arguemnts').then(done).catch(error)
            }
        });
    })
}

module.exports = {
    desc: 'Pray to tribute',
    func: tribute
}