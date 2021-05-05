const { Reset,FgRed,FgGreen,FgYellow,FgBlue } = require("./colors.js");

function successLog(msg){
    colorLog(msg, FgGreen)
}

function failLog(msg){
    console.error(`${FgBlue}[${new Date().toISOString()}] ${FgRed}${msg}${Reset}`)
}

function infoLog(msg){
    console.info(`${FgBlue}[${new Date().toISOString()}] ${FgYellow}${msg}${Reset}`)
}

function colorLog(msg, color){
    console.log(`${FgBlue}[${new Date().toISOString()}] ${color}${msg}${Reset}`)
}

module.exports = {
    success: successLog,
    fail: failLog,
    info: infoLog,
    color: colorLog
}