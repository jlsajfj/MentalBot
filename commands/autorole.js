const Send = require("../send.js")
const Log = require("../logging.js")
const { readFile, writeFile } = require('fs')

var auto_roles;
var all_roles;

function autorole(msg, args){
    if(args.length < 2) return
    if(args.length == 2) {
        if(!all_roles){
            if(auto_roles.length){
                let role_promises = auto_roles.map( elem => {
                    return new Promise( done => {
                        msg.guild.roles.fetch(elem)
                            .then(done)
                            .catch(Log.fail)
                    })
                })
                Promise.all(role_promises).then( role_fetched => {
                    let role_names = role_fetched.map(elem => elem.name);
                    all_roles = role_names.join('\n')
                    Send.success(msg, `Current role list:\n${all_roles}`)
                })
            } else {
                Send.success(msg, `There are no default roles`)
            }
        } else {
            Send.success(msg, `Current role list:\n${all_roles}`)
        }
    } else if(args.length == 3) {
        return new Promise( (done, error) => {
            var role = msg.guild.roles.cache.find(searchElem => searchElem.name.toLowerCase().includes(args[2].toLowerCase()))
            if(role){
                if(!auto_roles){
                    auto_roles = []
                }
                if(auto_roles.includes(role.id)){
                    Send.fail(msg, `"${role.name}" is already part of the automatic role set`)
                    error(`"${role.name}" is already part of the automatic role set`)
                } else {
                    auto_roles.push(role.id)
                    Send.success(msg, `"${role.name}" has been added to the automatic role set`)
                    writeFile('./roles.json', JSON.stringify(auto_roles, null, 4), (err, data) => {
                        if (err) throw err
                        
                        let role_promises = auto_roles.map( elem => {
                            return new Promise( done => {
                                msg.guild.roles.fetch(elem)
                                    .then(done)
                                    .catch(Log.fail)
                            })
                        })
                        Promise.all(role_promises).then( role_fetched => {
                            let role_names = role_fetched.map(elem => elem.name);
                            all_roles = role_names.join('\n')
                            done(`"${role.name}" has been added to the automatic role set`)
                        })
                    })
                    
                }
            } else {
                Send.fail(msg, `There is no role named "${args[2]}"`)
                error(`There is no role named "${args[2]}"`)
            }
        })
    }
}

function init(client){
    readFile('./roles.json', (err, data) => {
        if (err){
            Log.fail("roles.json has an issue.")
            Log.fail(err.stack)
        }
        else {
            auto_roles = JSON.parse(data)
        }
    })
    client.on('guildMemberAdd', member => {
        if(auto_roles){
            member.roles.add(auto_roles)
            if(!all_roles){
                let role_promises = auto_roles.map( elem => {
                    return new Promise( done => {
                        member.guild.roles.fetch(elem)
                            .then(done)
                            .catch(Log.fail)
                    })
                })
                Promise.all(role_promises).then( role_fetched => {
                    let role_names = role_fetched.map(elem => elem.name);
                    all_roles = role_names.join('\n')
                    member.createDM.then( cnl => {
                        Send.success(cnl, `Welcome to Mental Hospital, <@${member.id}>! Here are your current roles:\n${all_roles}`)
                    })
                })
            }
        }
    })
}

module.exports = {
    name: 'setautoroles',
    desc: 'Set roles on join',
    func: autorole,
    init: init
}