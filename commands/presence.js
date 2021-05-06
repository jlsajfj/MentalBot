const Send = require("../send.js")
const Log = require("../logging.js")
const { MessageEmbed } = require('discord.js')

function presence(msg, args){
    if (args.length == 2){
        return new Promise( (done, error) => {
            for (activity of msg.author.presence.activities) {
                if (activity?.name === 'Spotify') {
                    const musicEmbed = new MessageEmbed()
                        .setColor('#FFECAC')
                        .setTitle(`${msg.author.username} is listening to ${activity.details}`)
                        .setDescription(`${activity.details} by ${activity.state} on Spotify`)
                        .setThumbnail(activity.assets.largeImageURL())
                    Send.success(msg, musicEmbed).then(done).catch(error)
                }
            }
        })
    }
}

module.exports = {
    desc: 'Get the details about a user\'s presence',
    func: presence
}