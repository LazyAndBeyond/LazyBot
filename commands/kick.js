module.exports = {
    "name": "kick",
    "dm": false,
    "args": true,
    "usage": "<mention> <reason>",
    "aliases": [],
    "permLevel": "Admin",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Server-Moderation",
    "description": "Kicks a member.",
  execute(message, args, level) {
    try {
    const permission = message.guild.me.hasPermission('KICK_MEMBERS')
    if (!permission) return message.reply('**Unable to execute the command**: I dont have permisson to kick members.')
    const bot = message.client
    const Discord = require('discord.js')
    var args1 = message.content.split(' ').splice(1)
    if (!args1[1]) return message.reply('**Unable to execute the command**: no reason provided.')  
    const member = message.mentions.members.first()
    if (!member) return message.reply('**Unable to execute the command**: no user to kick provided.')
    if (!member.kickable) return message.reply('**Unable to execute the command**: The member has higher role than me.')
    const reason = args1.slice(1).join(' ')
    var embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle(`You have been kicked from ${message.guild.name}`)
    .addField('Moderator', message.author.username)
    .addField('Action', 'Kick')
    .addField('Reason', reason)
    .addField('Guild', message.guild.name)
    .setFooter('Kicked at', bot.user.displayAvatarURL)
    .setTimestamp()
    member.send(embed)
    member.kick()
    message.reply(`**${member.username}** successfully kick`)
    } catch(err) {
      console.log(err)
    }
  }
}