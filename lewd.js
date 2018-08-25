module.exports = {
    "name": "lewd",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": ["lewdneko"],
    "permLevel": "User",
    "nsfw": true,
    "enabled": true,
    "cooldown": 2,
    "category": "Nsfw-Commands",
    "description": "Same as neko command but the lewd version ;P",
  execute(message, args, level) {
    const neko = require('neko.js')
    const nekoclient = new neko.Client()
        nekoclient.LewdNeko().then((LewdNeko) => message.channel.send({
          embed: {
            color: message.client.functions.getRandomInt(),
            image: {
              url: LewdNeko.neko
            }
          }

        }).catch(e => console.warn('wew tf happened here ' + e)))
  }
}