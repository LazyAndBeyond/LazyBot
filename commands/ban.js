module.exports = {
    "name": "ban",
    "dm": false,
    "args": true,
    "usage": "<mention> <reason>",
    "aliases": [],
    "permLevel": "Admin",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Server-Moderation",
    "description": "Bans a member.",
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
    if (!member.bannable) return message.reply('**Unable to execute the command**: The member has higher role than me.')
    const reason = args1.slice(1).join(' ')
    var embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle(`You have been banned from ${message.guild.name}`)
    .addField('Moderator', message.author.username)
    .addField('Action', 'Ban')
    .addField('Reason', reason)
    .addField('Guild', message.guild.name)
    .setFooter('Banned at', bot.user.displayAvatarURL)
    .setTimestamp()
    member.send(embed)
    member.ban()
    message.reply(`**${member.username}** successfully banned`)
  } catch(err) {
    console.log(err)
  }
 }
}