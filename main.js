const Discord = require("discord.js")
const config = require("./config.json")
const replies = require("./replies.json")
const clear = require("./clear.js")
// const colors = require("./colors.js");
// import * from './colors.js'

// taken from https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color but redone my way
const { Reset,Bright,Dim,Underscore,Blink,Reverse,Hidden,FgBlack,FgRed,FgGreen,FgYellow,FgBlue,FgMagenta,FgCyan,FgWhite,BgBlack,BgRed,BgGreen,BgYellow,BgBlue,BgMagenta,BgCyan,BgWhite } = require("./colors.js");
const { sendSuccess, sendWarning, sendFail } = require("./send.js")

const client = new Discord.Client();
client.login(config.token);

console.log(`${FgYellow}MentalBot is initializing${Reset}`)

client.on('ready', () => {
	console.log(FgGreen + 'MentalBot is online' + Reset);
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
			console.log(FgYellow + `${msg.author.username} sent the message: ${msg.content}` + Reset)
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
  console.log(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
})
