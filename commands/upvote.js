module.exports = {
    "name": "upvote",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": ["vote"],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Support-Commands",
    "description": "We need you to upvote the bot in discord bot list so it gets more known to discord communitys!",
  execute(message, args, level) {
    const Discord = require('discord.js')
    const embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle('Thank you for upvoting me!! (you can do it every 12hs!)')
    .addField(`:link: Link`, `[Discord Bot List URL](https://discordbots.org/bot/358198916539482112)`)
    
    message.channel.send(embed)
  }
}