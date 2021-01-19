const { sendSuccess, sendWarning, sendFail } = require("./send.js")
const { DiscordAPIError } = require("discord.js")
const { Reset,Bright,Dim,Underscore,Blink,Reverse,Hidden,FgBlack,FgRed,FgGreen,FgYellow,FgBlue,FgMagenta,FgCyan,FgWhite,BgBlack,BgRed,BgGreen,BgYellow,BgBlue,BgMagenta,BgCyan,BgWhite } = require("./colors.js");

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
		if(e instanceof DiscordAPIError){
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

module.exports = clear