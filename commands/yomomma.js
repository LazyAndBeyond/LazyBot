module.exports = {
    "name": "yomomma",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "ur mom fat.",
  execute(message, args, level) {
    const snek = require('snekfetch')
    snek.get('http://api.yomomma.info/').then(res => {
      message.channel.send(`_${JSON.parse(res.body).joke}_`)
    })
  }
}