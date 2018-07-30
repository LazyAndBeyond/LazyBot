module.exports = {
    "name": "cat",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "Returns a picture of a cat.",
    execute(message, args, level) {
      const snekfetch = require('snekfetch')
      const Discord = require('discord.js')
      const bot = message.client
      snekfetch.get('https://thecatapi.com/api/images/get?api_key=MzM0MzA0')
        .then((res) => {
          const embed = new Discord.RichEmbed()
            .setTitle(`Some random cute cats`)
            .setColor('RANDOM')
            .setImage(res.headers.original_image)
            .setTimestamp()
            .setFooter('Requested At:', bot.user.displayAvatarURL)
          message.channel.send(embed)
        })
    }
}