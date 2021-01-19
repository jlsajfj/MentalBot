const {TextChannel} = require("discord.js")
const Log = require("./log.js")

function sendSuccess(recv, msg){
	return new Promise( (done, error) => {
		if(recv instanceof TextChannel){
			recv.send(msg)
					.then(message => {
						Log.success(`Sent message: ${message.content}`)
						done(message);
					})
					.catch(e => error(e));
		}
		else{
			recv.channel.send(msg)
					.then(message => {
						Log.success(`Sent message: ${message.content}`)
						done(message);
					})
					.catch(e => error(e));
		}
	});
}

function sendFail(recv, msg){
	return new Promise( (done, error) => {
		if(recv instanceof TextChannel){
			recv.send(msg)
					.then(message => {
						Log.fail(`Sent message: ${message.content}`)
						done(message);
					})
					.catch(e => error(e));
		}
		else{
			recv.channel.send(msg)
					.then(message => {
						Log.fail(`Sent message: ${message.content}`)
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
						Log.info(`Sent message: ${message.content}`)
						done(message);
					})
					.catch(e => error(e));
		}
		else{
			recv.channel.send(msg)
					.then(message => {
						Log.info(`Sent message: ${message.content}`)
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
						Log.color(`Sent message: ${message.content}`, color)
						done(message);
					})
					.catch(e => error(e));
		}
		else{
			recv.channel.send(msg)
					.then(message => {
						Log.color(`Sent message: ${message.content}`, color)
						done(message);
					})
					.catch(e => error(e));
		}
	});
}

module.exports = {
	success: sendSuccess,
	fail: sendFail,
	info: sendInfo,
	color: sendColor
}