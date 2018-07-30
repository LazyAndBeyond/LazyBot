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
    "description": "Look at Da tits!",
  execute(message, args, level) {
    const Discord = require('discord.js')
    const snekfetch = require('snekfetch')

    const id = [Math.floor(Math.random() * 10930)]   
    snekfetch.get(`http://api.oboobs.ru/boobs/${id}`).then(r => {
      const preview = r.body[0]['PREVIEW'.toLowerCase()]
      const image = `http://media.oboobs.ru/${preview}`
      const embed = new Discord.RichEmbed()
        .setTitle('DA TITS!!')
        .setImage(image)
        .setColor('RANDOM')
      message.channel.send(embed)
    })
  }
}