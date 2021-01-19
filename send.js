const {TextChannel} = require("discord.js")
const { Reset,Bright,Dim,Underscore,Blink,Reverse,Hidden,FgBlack,FgRed,FgGreen,FgYellow,FgBlue,FgMagenta,FgCyan,FgWhite,BgBlack,BgRed,BgGreen,BgYellow,BgBlue,BgMagenta,BgCyan,BgWhite } = require("./colors.js");

function sendSuccess(recv, msg){
	return sendColor(recv, msg, FgGreen)
}

function sendFail(recv, msg){
	return new Promise( (done, error) => {
		if(recv instanceof TextChannel){
			recv.send(msg)
					.then(message => {
						failLog(`Sent message: ${message.content}`)
						done(message);
					})
					.catch(e => error(e));
		}
		else{
			recv.channel.send(msg)
					.then(message => {
						failLog(`Sent message: ${message.content}`)
						done(message);
					})
					.catch(e => error(e));
		}
	});
}

function sendInfo(recv, msg){
	return new Promise( (done, error) => {
		if(recv instanceof TextChannel){
			recv.send(msg)
					.then(message => {
						infoLog(`Sent message: ${message.content}`)
						done(message);
					})
					.catch(e => error(e));
		}
		else{
			recv.channel.send(msg)
					.then(message => {
						infoLog(`Sent message: ${message.content}`)
						done(message);
					})
					.catch(e => error(e));
		}
	});
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
	console.error(`${FgRed}${msg}${Reset}`)
}

function infoLog(msg){
	console.info(`${FgYellow}${msg}${Reset}`)
}

function colorLog(msg, color){
	console.log(`${color}${msg}${Reset}`)
}

module.exports = {
	sendSuccess: sendSuccess,
	sendFail: sendFail,
	sendInfo: sendInfo,
	sendColor: sendColor,
	successLog: successLog,
	infoLog: infoLog,
	failLog: failLog,
	colorLog: colorLog
}