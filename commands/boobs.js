module.exports = {
    "name": "boobs",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": ["tits"],
    "permLevel": "User",
    "nsfw": true,
    "enabled": true,
    "cooldown": 2,
    "category": "Nsfw-Commands",
    "description": "Anyone could use looking at some nice boobs here and there",
  execute(message, args, level) {
    const Discord = require('discord.js')
    const snekfetch = require('snekfetch')

    const id = [Math.floor(Math.random() * 10930)]   
    snekfetch.get(`http://api.oboobs.ru/boobs/${id}`).then(r => {
      const preview = r.body[0]['PREVIEW'.toLowerCase()]
      const image = `http://media.oboobs.ru/${preview}`
      const embed = new Discord.RichEmbed()
        .setTitle('A man of culture, i see.')
        .setImage(image)
        .setColor('RANDOM')
      message.channel.send(embed)
    })
  }
}