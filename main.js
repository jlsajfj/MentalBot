const Discord = require("discord.js")
const config = require("./config.json")
const replies = require("./replies.json")
const clear = require("./clear.js")

const { sendSuccess, sendInfo, sendFail, successLog, infoLog, failLog } = require("./send.js")

const client = new Discord.Client();
client.login(config.token);

infoLog("MentalBot is initializing")

client.on('ready', () => {
	successLog('MentalBot is online')
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
			infoLog(`${msg.author.username} sent the message: ${msg.content}`)
			var args = msg.content.split(' ')
			if(args.length == 1){
				sendSuccess(msg, replies.default_reply)
				return
			}
			if(args[0]!=`<@!${client.user.id}>`&&args[0]!=`<@${client.user.id}>`){
				sendSuccess(msg, replies.mistake_tag)
				return
			}
			if(!(args[1] in commands)){
				sendFail(msg, replies.invalid_command)
				return
			}
			var command = commands[args[1]]
			if(msg.member.roles.cache.find(roles => roles.name === command['perms'])){
				command['function'](msg, args)
				return
			}
			sendFail(msg, replies.insufficient_permissions)
		}
	}
});

client.on('rateLimit', info => {
  infoLog(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
})
