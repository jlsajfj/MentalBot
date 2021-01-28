const { Reset,Bright,Dim,Underscore,Blink,Reverse,Hidden,FgBlack,FgRed,FgGreen,FgYellow,FgBlue,FgMagenta,FgCyan,FgWhite,BgBlack,BgRed,BgGreen,BgYellow,BgBlue,BgMagenta,BgCyan,BgWhite } = require("./colors.js");

function successLog(msg){
    colorLog(msg, FgGreen)
}

function failLog(msg){
    console.error(`${FgRed}${msg}${Reset}`)
}

function infoLog(msg){
    console.info(`${FgYellow}${msg}${Reset}`)
}

function colorLog(msg, color){
    console.log(`${color}${msg}${Reset}`)
}

module.exports = {
    success: successLog,
    fail: failLog,
    info: infoLog,
    color: colorLog
}