module.exports = {
    "name": "unlock",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "Mod",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Server-Moderation",
    "description": "Unlocks the channel for everyone.",
    execute(message, args, level) {
      const Discord = require('discord.js')
      const permissions = message.channel.permissionOverwrites.get(message.guild.id)
      if (!permissions.deny === 2048 || !permissions.deny === 3072) return message.reply('**Unable to execute the command**:the channel is already unlocked!')
      const botper = message.guild.me.hasPermission('MANAGE_CHANNELS')
  if (!botper) return message.reply('**Unable to execute the command**:i dont even have permission to manage channels!')
        const embed = new Discord.RichEmbed()
          .setColor('RANDOM')
          .setTimestamp()
          .addField('Action:', 'Unlock')
          .addField('Channel:', message.channel)
          .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
      message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: null
    })
    message.channel.send('Lockdown Lifted') 
    }
}