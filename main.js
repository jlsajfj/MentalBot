const Discord = require("discord.js")
const config = require("./config.json")
const replies = require("./replies.json")
const clear = require("./clear.js")

const Send = require("./send.js")
const Log = require("./log.js")

const client = new Discord.Client();
client.login(config.token);

Log.info("MentalBot is initializing")

client.on('ready', () => {
	Log.success('MentalBot is online')
});

var commands = {
	'clear': {
		'function': clear,
		'perms': 'Warden'
	}
}

client.on("message", msg => {
	if(msg.author.id === client.user.id) return
	if(msg.mentions.users){
		if(msg.mentions.users.keyArray().includes(client.user.id)){
			Log.info(`${msg.author.username} sent the message: ${msg.content}`)
			var args = msg.content.split(' ')
			if(args.length == 1){
				Send.success(msg, replies.default_reply)
				return
			}
			if(args[0]!=`<@!${client.user.id}>`&&args[0]!=`<@${client.user.id}>`){
				Send.success(msg, replies.mistake_tag)
				return
			}
			if(!(args[1] in commands)){
				Send.fail(msg, replies.invalid_command)
				return
			}
			var command = commands[args[1]]
			if(msg.member.roles.cache.find(roles => roles.name === command['perms'])){
				command['function'](msg, args)
				return
			}
			Send.fail(msg, replies.insufficient_permissions)
		}
	}
});

client.on('rateLimit', info => {
  Log.info(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
})
