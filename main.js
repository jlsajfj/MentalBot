const { Client, Collection } = require("discord.js");
const { readdirSync, readFile } = require("fs");
const { join } = require("path");

const { config, replies, perms } = require("./config")

const Send = require("./send.js")
const Log = require("./logging.js")


const client = new Client();
client.login(config.token);
client.commands = new Collection();

Log.info("MentalBot is initializing")
client.on('ready', () => {
	client.user.setPresence({
		activity:{
			name: 'some mental game'
		},
		status: 'online'
	})
	Log.success('MentalBot is online')
});

const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async(msg) => {
	if(msg.author.id === client.user.id) return
	await readFile('./auto_replies.json', (err, data) => {
		if (err) throw err;
		var auto_replies = JSON.parse(data);
		if(msg.content in auto_replies){
			Log.info(`${msg.author.username} sent the message: ${msg.content}`)
			Send.success(msg, auto_replies[msg.content])
			return
		}
	});
	if(msg.mentions.users){
		if(msg.mentions.users.keyArray().includes(client.user.id)){
			Log.info(`${msg.author.username} sent the message: ${msg.content}`)
			var args = msg.content.split(' ')
			if(args.length == 1){
				Send.success(msg, replies.default_reply)
				return
			}
			if(args[0]!=`<@!${client.user.id}>`&&args[0]!=`<@${client.user.id}>`){
				Send.success(msg, replies.mistake_tag)
				return
			}
			const command = client.commands.get(args[1])
			if(!command){
				Send.fail(msg, replies.invalid_command)
				return
			}
			// Log.info(command)
			// Log.info(perms[args[1]]['perms'])
			if(msg.member.roles.cache.find(r => perms[args[1]].includes(r.name))){
				command(msg, args, client)
				return
			}
			Send.fail(msg, replies.insufficient_permissions)
		}
	}
});

client.on('rateLimit', info => {
  Log.info(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
})
