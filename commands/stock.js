const Send = require("../send.js")
const Log = require("../logging.js")
const { MessageEmbed } = require('discord.js')
const { execFile } = require('child_process')
const { unlink } = require('fs')
const { join } = require("path")

function stock_chart(msg, args){
    if(args.length < 3) return Send.fail('Not enough args')
    Send.info(msg, `Attempting to fetch chart for ${args[2].toUpperCase()}`).then( new_msg => {
        // const pwd = spawn('pwd').stdout.on('data', Log.info)
        const stock_find_process = execFile('./commands/stock-chart.py', [args[2], 'default'])
        
        stock_find_process.stdout.on('data', data => {
            var trimmed_data = data.trim()
            var path = join(__dirname, `../${trimmed_data}`)
            Log.info(`File ${trimmed_data} generated at ${path}`)
            
            const stock_embed = new MessageEmbed()
                .setColor('#FFECAC')
                .setTitle(`Stock Chart for ${args[2].toUpperCase()}`)
                .attachFiles([path])
                .setImage(`attachment://${trimmed_data}`)
                .setFooter("Retrieved")
                .setTimestamp()
            new_msg.edit(stock_embed).then( () => {
                unlink(path, (err) => {
                    if (err) throw err;
                    Log.success('Temp file removed')
                })
            })
        })
    })
}

module.exports = {
    name: 'stock',
    desc: 'Get stock chart',
    func: stock_chart
}