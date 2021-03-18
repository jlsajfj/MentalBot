const Send = require("../send.js")
const Log = require("../logging.js")
const { MessageEmbed } = require('discord.js')
const { spawn } = require('child_process')

function stock_chart(msg, args){
    if(args.length < 2) return Send.fail('Not enough args')
}

module.exports = {
    name: 'stock'
    desc: 'Get stock chart',
    func: stock_chart
}