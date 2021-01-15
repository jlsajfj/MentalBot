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
			console.log(FgYellow + `${msg.author.username} sent the message ${msg.content}` + Reset)
			commands(msg);
		}
	}
});

function commands(msg) {
	var args = msg.content.split(' ')
	if(args.length == 1){
		msg.channel.send('what do you want')
			.then(message => console.log(`${FgGreen}Sent message: ${message.content}${Reset}`))
			.catch(console.error);
		return
	}
}

//copied from https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
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