const Send = require("../send.js")

function ping(message){
    const timeTaken = Date.now() - message.createdTimestamp;
    return Send.success(message, `:ping_pong: ${timeTaken}ms.`)
}

module.exports = {
    description: 'Ping!',
    func: ping
}