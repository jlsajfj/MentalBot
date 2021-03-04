const Send = require("../send.js")
const Log = require("../logging.js")

function pin(msg, args){
    var reas = "MentalBot was told to"
    if(args.length > 2){
        reas = args[2]
        for (var i = 3; i < args.length; i++)
            reas += ' ' + args[i]
    }
    return new Promise( (done, error) => {
        var cnl = msg.channel;
        if (msg.reference){
            var refID = msg.reference.messageID;
            cnl.messages.fetch(refID).then(found => {
                found.pin({ reason: reas }).then(result => {
                    Log.success(`Pin success for message "${found.content}", with reason "${reas}"`)
                    done(result)
                }).catch(error)
            }).catch(error)
        } else {
            Send.fail(`No referenced message`)
            error(new Error('No referenced message'))
        }
    })
}

module.exports = pin