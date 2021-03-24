const Send = require("../send.js")
const Log = require("../logging.js")
const ytdl = require("ytdl-core")
const replies = require("../config/replies.json")

var voice_channel

var queue = new Map();

async function music(msg, args, client){
	if(args[2]==='play'){
		voice_channel = msg.member.voice.channel;
		
		if(!voice_channel){
			Send.fail(replies.no_voice_connected)
		}
		voice_channel.join().then(connection => {
			const dispatcher = connection.play(ytdl(args[3], { quality: 'highestaudio' }), { volume: 0.5 });
			dispatcher.on("end", end => {
				voice_channel.leave();
			});
		}).catch(err => console.log(err));
	}
	else if(args[2]==='stop'){
		voice_channel.leave()
	}
	else if(args[2]==='add'){
	}
}

module.exports = {
    desc: 'Play music',
    func: music
}