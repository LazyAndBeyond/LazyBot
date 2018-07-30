module.exports = {
    "name": "lockdown",
    "dm": false,
    "args": true,
    "usage": "<time>",
    "aliases": [],
    "permLevel": "Mod",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Server-Moderation",
    "description": "Locks down the channel for everyone except for the staff (only for everyone role)",
  execute(message, args, level) {
  const ms = require('ms')
  const Discord = require('discord.js')
  const permissions = message.channel.permissionOverwrites.get(message.guild.id)
  if (permissions.deny === 2048 || permissions.deny === 3072) return message.reply('**Unable to execute the command**:the channel is already locked!')
  const botper = message.guild.me.hasPermission('MANAGE_CHANNELS')
  if (!botper) return message.reply('**Unable to execute the command**:i dont even have permission to manage channels!')
  const argu = message.content.split(' ').splice(1)
  const time = argu[0]
  if (!time) return message.reply('**Unable to execute the command**:you must set a duration for the lockdown in either hours, minutes or seconds')
  const embed = new Discord.RichEmbed()
.setColor('RANDOM')
.setTimestamp()
.addField('Action:', 'Lockdown')
.addField('Channel:', message.channel)
.addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
.addField('Time:', `${time}`)

  message.channel.overwritePermissions(message.guild.id, {
    SEND_MESSAGES: false
  })
  message.channel.send(embed)
    
    if (permissions.deny === 2048 || permissions.deny === 3072) {
  setTimeout(function () {
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: null
    })
    message.channel.send('Lockdown Lifted')
  }, ms(time))
    } else {
      return;
    }
  }
}