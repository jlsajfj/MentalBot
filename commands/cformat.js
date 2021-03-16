const Send = require("../send.js")
const { MessageEmbed } = require('discord.js')

function code_format(msg, args){
    if(args.length < 2) return Send.fail('Not enough args')
    var cnl = msg.channel;
    if (msg.reference){
        var refID = msg.reference.messageID
        cnl.messages.fetch(refID).then( found_message => {
            var found_content = found_message.content
            while(!found_content.endsWith('```')){
                found_content += '`'
            }
            while(found_content.startsWith('`')){
                found_content = found_content.substr(1)
            } 
            if(args[2]){
                found_content = args[2] + '\n' + found_content
            }
            found_content = '```' + found_content
            const code_embed = new MessageEmbed()
                .setColor('#FFECAC')
                .setTitle('Formatted Code')
                .setDescription(found_content)
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