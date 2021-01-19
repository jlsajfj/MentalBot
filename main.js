const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");

const Send = require("./send.js")
const Log = require("./log.js")

const config = require("./config.json")
const replies = require("./replies.json")
const perms = require("./commands.json")


const client = new Client();
client.login(config.token);
client.commands = new Collection();

Log.info("MentalBot is initializing")
client.on('ready', () => {
	Log.success('MentalBot is online')
});

const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", msg => {
	if(msg.author.id === client.user.id) return
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
			if(!(args[1] in perms)){
				Send.fail(msg, replies.invalid_command)
				return
			}
			// Log.info(command)
			const command = client.commands.get(args[1])
			if(msg.member.roles.cache.find(roles => roles.name === perms[args[1]]['perms'])){
				command(msg, args)
				return
			}
			Send.fail(msg, replies.insufficient_permissions)
		}
	}
});

client.on('rateLimit', info => {
  Log.info(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
})
