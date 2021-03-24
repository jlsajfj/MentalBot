const Send = require("../send.js")
const Log = require("../logging.js")
const { MessageEmbed } = require('discord.js')
const { execFile } = require('child_process')
const { unlink } = require('fs')
const { join } = require("path")

function stock_chart(msg, args){
    if(args.length < 3) return Send.fail(msg, 'Not enough arguments')
    return new Promise( (done, error) => {
        var ticker = args[2].toUpperCase()
        Send.info(msg, `Attempting to fetch chart for ${ticker}`).then( new_msg => {
            // const pwd = spawn('pwd').stdout.on('data', Log.info)
            const stock_find_process = execFile('./commands/stock-chart.py', [ticker, 'default'])
            var data = '';
            stock_find_process.stdout.on('data', _data => {
                data = _data.trim()
            })
            var err = '';
            stock_find_process.stderr.on('data', data => {
                err += data
            })
            
            stock_find_process.on('exit', () => {
                new_msg.delete()
                
                if(data != ''){
                    var path = join(__dirname, `../${data}`)
                    Log.info(`File ${data} generated at ${path}`)
                    
                    const stock_embed = new MessageEmbed()
                        .setColor('#FFECAC')
                        .setTitle(`Stock Chart for ${ticker}`)
                        .attachFiles([path])
                        .setImage(`attachment://${data}`)
                        .setFooter("Retrieved")
                        .setTimestamp()
                    Send.success(msg, stock_embed).then( sent_msg => {
                        unlink(path, (err) => {
                            if (err) throw err;
                            Log.success('Temp file removed')
                            done(sent_msg)
                        })
                    }).catch(error)
                }
                
                if(err != ''){
                    if(err.trim().split('\n').slice(-1)[0].includes("No ticker info")){
                        Send.fail(msg, `${ticker} is not a valid ticker`).then(done).catch(error)
                    } else {
                        error(err)
                    }
                }
            })
        })
    })
}

module.exports = {
    name: 'stock',
    desc: 'Get stock chart',
    func: stock_chart
}