/*

MODULE.EXPORTS OPTIONS

name [string]
dm [boolean]
args [boolean]
usage [string]
aliases [array]
permissions [Integer]
nsfw [boolean]
enabled [boolean]
cooldown [Integer]
category [string]
execute [function]

*/


module.exports = {
    "name": "ping",
    "dm": true,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Costum-Commands",
    "description": "Displays the current ping of the bot and the Websocket ping.",
  execute(message, args, level) {
  var then = Date.now()
    message.channel.send('Ping?').then(m => {
      m.edit(`Pong! **${Math.round((Date.now() - then) / 3)}**ms (Bot ping), **${message.client.ping}**ms (Websocket ping)`)
    }) 
  }
  
} //There simple ping command should be done