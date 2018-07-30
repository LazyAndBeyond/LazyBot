module.exports = {
    "name": "avatar",
    "dm": false,
    "args": true,
    "usage": "<mention>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Costum-Commands",
    "description": "Remember when you want a user avatar but he doesn't want to give it, well you can have it now.",
  execute(message, args, level) {
     const Discord = require('discord.js')
     const bot = message.client
      const user = message.mentions.users.first()
      let avatar = user.displayAvatarURL
      let embed = new Discord.RichEmbed()

        .setAuthor('Avatar requested by: ' + message.author.username)
        .setColor('RANDOM')
        .setImage(avatar)
        .setFooter('Requested at: ', bot.user.displayAvatarURL)
        .setTimestamp()

      message.channel.send(embed)
  }
}