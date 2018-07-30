module.exports = {
    "name": "wallpaper",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": ["wallpapers"],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "It does what it says... (sometimes the api fails so try again if it does)",
  execute(message, args, level) {
    const randomAnimeWallpapers = require('random-anime-wallpapers')
          const argss = message.content.split(' ').splice(1)
      randomAnimeWallpapers(args)
        .then(images => {
          let img = images[Math.floor(Math.random() * images.length)]
          if (!img) return message.channel.send('no result fund for **' + argss + '**')
          message.channel.send({
            embed: {
              color: message.client.functions.getRandomInt(),
              image: {
                url: img.full
              }
            }
          }).catch(e => console.warn('wew tf happened here ' + e))
        })
  }
}