module.exports = {
    "name": "hentai",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": true,
    "enabled": true,
    "cooldown": 2,
    "category": "Nsfw-Commands",
    "description": "Wait where are your hands going??",
  execute(message, args, level) {
  const Discord = require('discord.js')
  const randomPuppy = require('random-puppy')
  
    randomPuppy('Hentai')
      .then(url => {
        const embed = new Discord.RichEmbed()
              .setTitle(`Wait, where ur hand's going?`)
              .setImage(url)
              .setColor('RANDOM')
        return message.channel.send(embed)
      })
  }
}