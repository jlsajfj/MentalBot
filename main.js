const Discord = require("discord.js")
const config = require("./config.json")
const replies = require("./replies.json")
// const colors = require("./colors.js");
// import * from './colors.js'
// taken from https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color but redone my way

const { Reset,Bright,Dim,Underscore,Blink,Reverse,Hidden,FgBlack,FgRed,FgGreen,FgYellow,FgBlue,FgMagenta,FgCyan,FgWhite,BgBlack,BgRed,BgGreen,BgYellow,BgBlue,BgMagenta,BgCyan,BgWhite } = require("./colors.js");

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

client.on('rateLimit', (info) => {
  console.log(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
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
		await deleteMessages(cnl, 100)
		return
	}
	if(isNaN(args[2])){
		if(args[2].match(/<@!{0,1}\d+>/)){
			// console.log(args[2])
			// console.log(args[2].substring(args[2].indexOf('<@')+2+(args[2].indexOf('!')==-1?0:1),args[2].indexOf('>')))
			var count = 100
			if(args[3] && !isNaN(args[3])){
				count = parseInt(args[3])
			}
			var user = args[2].substring(args[2].indexOf('<@')+2+(args[2].indexOf('!')==-1?0:1),args[2].indexOf('>'))
			await deleteMessages(cnl, count, user, msg)
		}
		return
	}
	if(args.length == 3){
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

async function deleteMessages(cnl, count, user, mm){
	if(user){
		var m;
		var username;
		await client.users.fetch(user).then(u => username = u.username).catch(console.error)
		await sendWarning(cnl, `Clearing messages from ${username} in the last ${count} messages`).then( message => m = message).catch(console.error)
		var messages
		await cnl.messages.fetch({limit: count}).then( mmm => messages = mmm ).catch(console.error)
		// console.log(messages)
		var msgs = messages.filter( msg => {
			// console.log(msg)
			return msg.author.id === user
		})
		// console.log(msgs)
		await cnl.bulkDelete(msgs).then(messages => {
			console.log(`${FgGreen}Bulk deleted ${messages.size} message(s)${Reset}`)
		}).catch(console.error)
		if(user != client.user.id){
			m.delete()
		}
		if(mm.author.id != user){
			mm.delete()
		}
		return
	}
	var m;
	await sendWarning(cnl, `Clearing ${count} messages`).then( message => {
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
		var messages
		await msgs.fetch({limit: count}).then(mmm => messages = mmm).catch(console.error);
		console.log(`${FgYellow}Received ${messages.size} messages${Reset}`)
		//console.log(messages)
		var cnt = messages.size
		for (message of messages.keys()) {
			// console.log(`deleting ${message}`)
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

async function sendWarning(recv, msg){
	return sendColor(recv, msg, FgYellow)
}

async function sendColor(recv, msg, color){
	var m
	if(recv instanceof Discord.TextChannel){
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