module.exports = {
    "name": "ass",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": true,
    "enabled": true,
    "cooldown": 2,
    "category": "Nsfw-Commands",
    "description": "Look at Dat ass!",
  execute(message, args, level) {
    const Discord = require('discord.js')
    const snekfetch = require('snekfetch')

    const id = [Math.floor(Math.random() * 5000)]    
    snekfetch.get(`http://api.obutts.ru/butts_preview/${id}`).then(r => {
      const preview = r.body[0]['PREVIEW'.toLowerCase()]
      const image = `http://media.obutts.ru/${preview}`
      const embed = new Discord.RichEmbed()
        .setTitle('DAT ASS!!')
        .setImage(image)
        .setColor('RANDOM')
      message.channel.send(embed)
    })
  }
}