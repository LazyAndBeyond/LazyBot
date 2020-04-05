module.exports = {
    "name": "support",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Support-Commands",
    "description": "Join the support server if you ever need help",
  execute(message, args, level) {
    const Discord = require('discord.js')
    const bot = message.client
    const embed = new Discord.RichEmbed()
    .setTitle('Join the Official server if you seek support or you want to learn more')
    .setColor('RANDOM')
    .setThumbnail(bot.user.displayAvatarURL)
    .addField(':link: Invite Link', `[Invite URL](https://discord.gg/bTrcY8t)`)
    message.channel.send(embed)
  }
}