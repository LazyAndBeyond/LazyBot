module.exports = {
    "name": "giphy",
    "dm": false,
    "args": true,
    "usage": "<search query>",
    "aliases": ["gifs"],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Fun-Commands",
    "description": "some gifs from giphy",
  execute(message, args, level) {
    const giphy = require('quick-giphy')
      const argss = message.content.split(' ').splice(1)

      giphy({
          apiKey: 'P66vSybfG3Deu1DBHYc8vNnRwKHuV3d5',
          query: argss
        })
        .then(url => {
          message.channel.send({
            embed: {
              color: message.client.functions.getRandomInt(),
              image: {
                url: url
              }
            }

          }).catch(e => console.warn('wew tf happened here ' + e))
        })
  }
}