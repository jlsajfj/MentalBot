const {TextChannel} = require("discord.js")
const { Reset,Bright,Dim,Underscore,Blink,Reverse,Hidden,FgBlack,FgRed,FgGreen,FgYellow,FgBlue,FgMagenta,FgCyan,FgWhite,BgBlack,BgRed,BgGreen,BgYellow,BgBlue,BgMagenta,BgCyan,BgWhite } = require("./colors.js");

function sendSuccess(recv, msg){
	return sendColor(recv, msg, FgGreen)
}

function sendFail(recv, msg){
	return sendColor(recv, msg, FgRed)
}

function sendWarning(recv, msg){
	return sendColor(recv, msg, FgYellow)
}

function sendColor(recv, msg, color){
	return new Promise( (done, error) => {
		if(recv instanceof TextChannel){
			recv.send(msg)
					.then(message => {
						colorLog(`Sent message: ${message.content}`, color)
						done(message);
					})
					.catch(e => error(e));
		}
		else{
			recv.channel.send(msg)
					.then(message => {
						colorLog(`Sent message: ${message.content}`, color)
						done(message);
					})
					.catch(e => error(e));
		}
	});
}

function successLog(msg){
	colorLog(msg, FgGreen)
}

function failLog(msg){
	colorLog(msg, FgRed)
}

function warnLog(msg){
	colorLog(msg, FgYellow);
}

function colorLog(msg, color){
	console.log(`${color}${msg}${Reset}`)
}

exports.sendSuccess = sendSuccess
exports.sendFail = sendFail
exports.sendWarning = sendWarning
exports.sendColor = sendColor