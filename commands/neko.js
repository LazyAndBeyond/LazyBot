module.exports = {
    "name": "neko",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "Some kawaii neko girls for the anime lovers out there.",
  execute(message, args, level) {
    const neko = require('neko.js')
    const nekoclient = new neko.Client()
      nekoclient.neko().then((neko) => message.channel.send({
        embed: {
          color: message.client.functions.getRandomInt(),
          image: {
            url: neko.neko
          }
        }

      }).catch(e => console.warn('wew tf happened here ' + e)))
  }
}