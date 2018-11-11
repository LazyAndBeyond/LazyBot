module.exports = {
    "name": "invite",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Support-Commands",
    "description": "Invite the bot to yoru party",
  execute(message, args, level) {
    const Discord = require('discord.js')
    const bot = message.client
    const embed = new Discord.RichEmbed()
    .setTitle('Thank you for having me in your server Onii-chan!!')
    .setColor('RANDOM')
    .setThumbnail(bot.user.displayAvatarURL)
    .addField(':link: Invite Link', `[Invite URL](https://discordapp.com/oauth2/authorize?client_id=358198916539482112&scope=bot&permissions=1342565503)`)
    message.channel.send(embed)
  }
}