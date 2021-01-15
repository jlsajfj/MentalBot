// copied from https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
// end of copied stuff

const Discord = require("discord.js");
const config = require("./config.json");
const replies = require("./replies.json");

const client = new Discord.Client();
client.login(config.token);

console.log(`${FgYellow}MentalBot is initializing${Reset}`)

client.on('ready', () => {
	console.log(FgGreen + 'MentalBot is online' + Reset);
});

client.on("message", msg => {
	if(msg.author.id === client.user.id) return
	if(msg.mentions.users){
		if(msg.mentions.users.keyArray().includes(client.user.id)){
			console.log(FgYellow + `${msg.author.username} sent the message: ${msg.content}` + Reset)
			mental(msg);
		}
	}
});

var limiter = 0;
client.on('rateLimit', (info) => {
  console.log(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
  limiter = info.timeout
})

var commands = {
	'clear': clear
}

var perms = {
	'clear': 'Warden'
}

function mental(msg) {
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
	if(msg.member.roles.cache.find(roles => roles.name === perms[args[1]])){
		commands[args[1]](msg, args)
		return
	}
	sendFail(msg, replies.insufficient_permissions)
}

async function clear(msg, args){
	var cnl = msg.channel
	if(args.length == 2){
		deleteMessages(cnl, 100)
		return
	}
	if(args.length == 3){
		if(isNaN(args[2])){
			return
		}
		var cnt = parseInt(args[2])
		if(cnt < 100){
			deleteMessages(cnl, cnt)
			return
		}
		while(cnt > 0){
			if(cnt > 100){
				await deleteMessages(cnl, 100)
				await new Promise(r => setTimeout(r, 1500));
				cnt -= 100
				continue
			}
			await deleteMessages(cnl, cnt)
			cnt = 0
		}
		return
	}
}

async function deleteMessages(cnl, count){
	var m;
	await sendWarning(cnl, `Clearing ${count} messages`, 1).then( message => {
		m = message
	})
	await cnl.bulkDelete(count).then(messages => {
		console.log(`${FgGreen}Bulk deleted ${messages.size} message(s)${Reset}`)
		return
	}).catch(async (e) => {
		if(e instanceof Discord.DiscordAPIError){
			console.error(`${FgRed}Discord API Error: Deleting over two weeks\nStarting workaround\n${Bright}THIS IS VERY SLOW${Reset}`)
		}
		// console.error(e)
		var msgs = cnl.messages
		var messages;
		await msgs.fetch({limit: count}).then(mmm => messages = mmm).catch(console.error);
		console.log(`${FgYellow}Received ${messages.size} messages${Reset}`)
		//console.log(messages)
		var cnt = messages.size
		for (message of messages.keys()) {
			// console.log(`deleting ${message}`)
			if(limiter!=0){
				console.log(`${cnt} remaining`)
				await new Promise(r => setTimeout(r, limiter))
				limiter = 0
			}
			await msgs.fetch(message).then( mess => mess.delete()).catch(console.error)
			cnt -= 1
			await new Promise(r => setTimeout(r, 1000))
		}
		console.log(`${FgGreen}Cleared ${count} messages${Reset}`)
	})
}

async function sendSuccess(recv, msg){
	return sendColor(recv, msg, FgGreen)
}

async function sendFail(recv, msg){
	return sendColor(recv, msg, FgRed)
}

async function sendWarning(recv, msg, flag){
	return sendColor(recv, msg, FgYellow, flag)
}

async function sendColor(recv, msg, color, flag){
	var m
	if(flag){
		await recv.send(msg)
				.then(message => {
					console.log(`${color}Sent message: ${message.content}${Reset}`)
					m = message
				})
				.catch(console.error);
	}
	else{
		await recv.channel.send(msg)
				.then(message => {
					console.log(`${color}Sent message: ${message.content}${Reset}`)
					m = message
				})
				.catch(console.error);
	}
	return m
}