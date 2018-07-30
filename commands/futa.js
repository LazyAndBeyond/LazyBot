module.exports = {
    "name": "futa",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": ["futanari"],
    "permLevel": "User",
    "nsfw": true,
    "enabled": true,
    "cooldown": 2,
    "category": "Nsfw-Commands",
    "description": "( ͡° ͜ʖ ͡°)",
  execute(message, args, level) {
  const Discord = require('discord.js')
  const randomPuppy = require('random-puppy')

    randomPuppy('Futanari')
      .then(url => {
        const embed = new Discord.RichEmbed()
              .setTitle(`( ͡° ͜ʖ ͡°)`)
              .setImage(url)
              .setColor('RANDOM')
        return message.channel.send(embed)
      })
  }
}