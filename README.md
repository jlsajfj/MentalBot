# MentalBot

A bot for a personal server, will be combining other bots.

The bot listens for mentions, and does commands based on that.

## Requirements

Just run NPM install, and all required packages should be installed. If you're curious they are as follows:

```
discord.js
ffmpeg
discord.js/opus
ytdl
```

To be completely honest I'm not entirely sure if I missed any.

## Commands

Always tag bot first, usage is written in Minecraft command convention.

| **Command** | **Usage** | **Description** |
| ---------------------------- | ---------------------------- | --------------------- |
| clear       | `clear [count/user] [count]` | Clears either all messages in the last `count` or all messages from set user in the last `count`. Default count is 100. |
| ping        | `ping` | Checks ping to bot. |
| music | `music <play/stop> [url]` | Not complete. |

## Auto-Replies

The bot will automatically reply to some phrases, without the need to tag.

![Auto-Reply Example](https://i.imgur.com/0MAFzWp.png)

The configuration is found in `auto_replies.json` and is formatted like below:

```json
{
  "trigger": "response",
  "Pizza": "Party!"
}
```

It can be edited live; it updates without need to restart the bot. However if the JSON is malformed then the bot will crash on the next new message.

## Examples
### Clear
![Clear example](https://imgur.com/nPNe3sQ.png)

The clear message (along with the sent command) are cleared after it is done.

### Ping
![Ping example](https://i.imgur.com/9tn5vuh.png)

## Setup

To use the bot a few configs must be setup. These are all found in the config folder, just remove `‑example` from the filename. These are all very self explanatory, but if needed here we are:

### config.json

`config.json` requires discord bot token, setup [here](https://discord.com/developers/applications/) (or follow [this guide](https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js)).

```json
{
  "token": "DISCORD_TOKEN"
}
```

### perms.json

The general structure of `perms.json` is the command followed by an array of allowed roles:

```json
{
  "clear": [
    "Admin"
  ],
  "ping": [
    "@everyone"
  ],
  "setreply": [
    "Admin",
    "Moderator"
  ],
  "music": [
    "DJ"
  ]
}
```

Notice `ping` uses `@everyone`, as expected this just means anyone can use the command.

### replies.json

Some confusion may occur here, `replies.json` are the replies required by the bot, not the autoreplies. `default_reply` is when the bot is pinged, with no arguments; `mistake_tag` occurs when the bot ping is not the first argument in the command. The rest you can read in the code.

```json
{
  "default_reply": "Hi there!",
  "mistake_tag": "Did you tag me by mistake?",
  "invalid_command": "Invalid command.",
  "insufficient_permissions": "You do not have permission for that command.",
  "no_voice_connected": "You need to be in a voice channel."
}
```

As you can see there is a `no_voice_connected`, that is for music, which is next to come for this bot.

## Code

This section is just if you care about how the bot actually works.

### Commands

The commands are set up in a modular way. As long as permissions are set up, then dropping a file into `commands` adds it to the bot, on next restart.

This is done with some code borrowed from [here](https://github.com/eritislami/evobot/blob/master/index.js):

```javascript
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}
```

The loading of the commands is borrowed from the same source:

```js
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
```

### Auto-Replies

On a user message, it is quickly checked against the set up JSON file here:

```javascript
await readFile('./auto_replies.json', (err, data) => {
  if (err) throw err;
  var auto_replies = JSON.parse(data);
  if(msg.content in auto_replies){
    Log.info(`${msg.author.username} sent the message: ${msg.content}`)
    Send.success(msg, auto_replies[msg.content])
    return
  }
});
```

It loads the replies and finds any matching to reply with. This is called every time a message is sent, so if there is malformed JSON in the config file it will break.

### Configs

The configs are loaded with Javascript destructuring:

```js
const { config, replies, perms } = require("./config")
```

Along with an `index.js` in the `config` folder:

```js
const config = require("./config.json")
const replies = require("./replies.json")
const perms = require("./perms.json")

module.exports = {
  config: config,
  replies: replies,
  perms: perms
}
```