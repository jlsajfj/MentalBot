const Send = require("../send.js")
const Log = require("../logging.js")

function pin(msg, args){
    return new Promise( (done, error) => {
        var _reason = "MentalBot was told to"
        if(args.length > 2){
            _reason = args[2]
            for (var i = 3; i < args.length; i++)
                _reason += ' ' + args[i]
        }
        var cnl = msg.channel;
        if (msg.reference){
            var refID = msg.reference.messageID;
            cnl.messages.fetch(refID).then(found => {
                found.pin({ reason: _reason }).then(result => {
                    Log.success(`Pin success for message "${found.content}", with reason "${_reason}"`)
                    done(result)
                }).catch(error)
            }).catch(error)
        } else {
            error(`No referenced message`)
        }
    })
}

module.exports = {
    desc: 'Pin a message',
    func: pin
}