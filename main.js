const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();
client.login(config.token);

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

var commands = {
	'clear': clear
}

function mental(msg) {
	var args = msg.content.split(' ')
	if(args.length == 1){
		sendSuccess(msg, 'what do you want')
		return
	}
	if(args[0]!=`<@!${client.user.id}>`){
		sendSuccess(msg,'did you tag me by mistake?')
		return
	}
	if(!(args[1] in commands)){
		sendFail(msg, 'invalid command')
		return
	}
	commands[args[1]](msg, args)
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
	await sendWarning(1, cnl, `Clearing ${count} messages`).then( message => {
		m = message
	})
	await cnl.bulkDelete(count).then(messages => {
		console.log(`${FgGreen}Bulk deleted ${messages.size} message(s)${Reset}`)
		return
	}).catch(console.error)
}

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

// this isnt copied
async function sendSuccess(recv, msg){
	return sendColor(recv, msg, FgGreen)
}

async function sendFail(recv, msg){
	return sendColor(recv, msg, FgRed)
}

async function sendWarning(recv, msg){
	return sendColor(recv, msg, FgYellow)
}

async function sendWarning(flag, recv, msg){
	return sendColor(flag, recv, msg, FgYellow)
}

async function sendColor(recv, msg, color){
	var m
	await recv.channel.send(msg)
			.then(message => {
				console.log(`${color}Sent message: ${message.content}${Reset}`)
				m = message
			})
			.catch(console.error);
	return m
}

async function sendColor(flag, recv, msg, color){
	var m
	await recv.send(msg)
			.then(message => {
				console.log(`${color}Sent message: ${message.content}${Reset}`)
				m = message
			})
			.catch(console.error);
	return m
}