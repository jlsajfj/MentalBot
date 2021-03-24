const Send = require("../send.js")
const Log = require("../logging.js")
const { MessageEmbed } = require('discord.js')

function msginfo(msg, args){
    var cnl = msg.channel;
    if (msg.reference){
        return new Promise( (done, error) => {
            var refID = msg.reference.messageID
            cnl.messages.fetch(refID).then( found_message => {
                var stamp = `Sent at: ${new Date(found_message.createdTimestamp).toLocaleString()}`
                if(found_message.editedTimestamp){
                    stamp += `\nEdited at: ${new Date(found_message.editedTimestamp).toLocaleString()}`
                }
                
                const found_author = found_message.author
                const author_avatar = `https://cdn.discordapp.com/avatars/${found_author.id}/${found_author.avatar}.png`
                
                const found_channel = found_message.channel
                const message_link = `https://discord.com/channels/${found_channel.guild.id}/${found_channel.id}/${found_message.id}`
                
                const info_embed = new MessageEmbed()
                    .setColor('#FFECAC')
                    .setTitle('Message Info')
                    .setAuthor(found_author.username, author_avatar)
                    .setDescription(`Content: ${found_message.content}`)
                    .setFooter(stamp)
                Send.success(msg, info_embed).then(done).catch(error)
            })
        })
    } else {
        return Send.fail('A replied message is required')
    }
}

module.exports = {
    desc: 'Get the details about a message',
    func: msginfo
}