const Send = require("../send.js")
const Log = require("../logging.js")
const { readFile, writeFile } = require('fs')
const { MessageEmbed } = require('discord.js')

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
                    all_roles = role_fetched
                    const role_embed = new MessageEmbed()
                        .setColor('#FFECAC')
                        .setTitle('Current Auto-Roles')
                        .setDescription(all_roles.map(elem => elem.name).join('\n'))
                    Send.success(msg, role_embed)
                })
            } else {
                Send.success(msg, `There are no default roles`)
            }
        } else {
            Send.success(msg, `Current role list:\n${all_roles.map(elem => elem.name).join('\n')}`)
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
                            all_roles = role_fetched
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
    Log.info('Setting up auto-role')
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
        Log.info(`${member.displayName} has joined the guild`)
        if(auto_roles && auto_roles.length){
            member.roles.add(auto_roles, "default roles")
            if(!all_roles){
                let role_promises = auto_roles.map( elem => {
                    return new Promise( done => {
                        member.guild.roles.fetch(elem)
                            .then(done)
                            .catch(Log.fail)
                    })
                })
                Promise.all(role_promises).then( role_fetched => {
                    all_roles = role_fetched
                    Send.success(member, `Welcome to Mental Hospital, <@${member.id}>! Here are your current roles:\n${all_roles.map(elem => elem.name).join('\n')}`)
                })
            } else {
                Send.success(member, `Welcome to Mental Hospital, <@${member.id}>! Here are your current roles:\n${all_roles.map(elem => elem.name).join('\n')}`)
            }
        } else {
            Log.info("No roles to add")
        }
    })
    Log.success('Completed')
}

module.exports = {
    desc: 'Set roles on join',
    func: autorole,
    init: init
}