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
      if (message.mentions.users.first().bot) {
    const permission = message.guild.me.hasPermission('KICK_MEMBERS')
    if (!permission) return message.reply('**Unable to execute the command**: I dont have permisson to kick members.')
      const member = message.mentions.members.first()
       member.kick()
      } else {
    
    const permission = message.guild.me.hasPermission('KICK_MEMBERS')
    if (!permission) return message.reply('**Unable to execute the command**: I dont have permisson to kick members.')
    const bot = message.client
    const Discord = require('discord.js')
    var args1 = message.content.split(' ').splice(1)
    const member = message.mentions.members.first()
    if (!member) return message.reply('**Unable to execute the command**: no user to kick provided.')
    if (!member.kickable) return message.reply('**Unable to execute the command**: The member has higher role than me.')
    let reason = args1.slice(1).join(' ')
    if (!reason) reason = 'not included'
    var embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle(`You have been kicked from ${message.guild.name}`)
    .addField('Moderator', message.author.username)
    .addField('Action', 'Kick')
    .addField('Reason', reason)
    .addField('Guild', message.guild.name)
    .setFooter('Kicked at', bot.user.displayAvatarURL)
    .setTimestamp()
    member.send(embed).catch(e => console.log(''))
    member.kick()
    message.reply(`**${member.displatName}** successfully kick`)
    var embed1 = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle(`${member.displayName} has been quicked from the guild`)
    .addField('Moderator', message.author.username)
    .addField('Action', 'Kick')
    .addField('Reason', reason)
    .addField('Guild', message.guild.name)
    .setFooter('Kicked at', bot.user.displayAvatarURL)
    .setTimestamp()
    message.channel.send(embed1)
      }
  }
}