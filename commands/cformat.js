const Send = require("../send.js")
const Log = require("../logging.js")
const { MessageEmbed } = require('discord.js')
const { spawn } = require('child_process')
const { writeFile } = require('fs')

function code_format(msg, args){
    if(args.length < 2) return Send.fail('Not enough args')
    var cnl = msg.channel;
    if (msg.reference){
        var refID = msg.reference.messageID
        cnl.messages.fetch(refID).then( found_message => {
            var found_content = found_message.content
            while(found_content.endsWith('`')){
                found_content = found_content.slice(0, -1)
            }
            while(found_content.startsWith('`')){
                found_content = found_content.slice(1)
            }
            var lang = ''
            if(args[2]){
                lang = args[2]
            } else {
                /*?=TODO: implement code language detection
                Log.info('Attempting to detect code language')
                const temp_file = Math.random().toString(36).substring(7)
                writeFile(`./commands/${temp_file}`, found_content, (err, data) => {
                    if (err) throw err
                    // const lang_detect = spawn('python', ['cformat_detect.py',
                })*/
            }
            const code_embed = new MessageEmbed()
                .setColor('#FFECAC')
                .setTitle('Formatted Code')
                .setDescription(`\`\`\`${lang}\n${found_content}\`\`\``)
            Send.success(msg, code_embed)
        })
    } else {
        return Send.fail('A replied message is required')
    }
}

module.exports = {
    desc: 'Reformat code',
    func: code_format
}