module.exports = {
    "name": "why",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "Why not?",
  execute(message, args, level) {
    const neko = require('neko.js')
    const nekoclient = new neko.Client()
nekoclient.why().then((why) => message.channel.send(why.why))
  }
}