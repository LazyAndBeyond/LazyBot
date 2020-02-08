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
      if (message.mentions.users.first().bot) {
    const permission = message.guild.me.hasPermission('BAN_MEMBERS')
    if (!permission) return message.reply('**Unable to execute the command**: I dont have permisson to ban members.')
      const member = message.mentions.members.first()
       member.ban()
      } else {
      
    const permission = message.guild.me.hasPermission('BAN_MEMBERS')
    if (!permission) return message.reply('**Unable to execute the command**: I dont have permisson to ban members.')
    const bot = message.client
    const Discord = require('discord.js')
    var args1 = message.content.split(' ').splice(1)
    const member = message.mentions.members.first()
    if (!member) return message.reply('**Unable to execute the command**: no user to ban provided.')
    if (!member.bannable) return message.reply('**Unable to execute the command**: The member has higher role than me.')
    let reason = args1.slice(1).join(' ')
    if (!reason) reason = 'not included'
    var embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle(`You have been banned from ${message.guild.name}`)
    .addField('Moderator', message.author.username)
    .addField('Action', 'Ban')
    .addField('Reason', reason)
    .addField('Guild', message.guild.name)
    .setFooter('Banned at', bot.user.displayAvatarURL)
    .setTimestamp()
    member.send(embed).catch()
    member.ban()
    message.reply(`**${member.displayName}** successfully banned`)
    var embed1 = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle(`${member.displayName} has been banned`)
    .addField('Moderator', message.author.username)
    .addField('Action', 'Ban')
    .addField('Reason', reason)
    .addField('Guild', message.guild.name)
    .setFooter('Banned at', bot.user.displayAvatarURL)
    .setTimestamp()
      }
      message.channel.send(embed1)
  } catch(err) {
    console.log(err)
  }
 }
}