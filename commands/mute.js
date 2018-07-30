module.exports = {
    "name": "mute",
    "dm": false,
    "args": true,
    "usage": "<mention> <time>",
    "aliases": [],
    "permLevel": "Mod",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Server-Moderation",
    "description": "Mute a member for a limited time (requires manage roles permission)",
  execute(message, args, level) {
    try {
        const Discord = require('discord.js')
        const bot = message.client
        const ms = require('ms')
        let args1 = message.content.split(' ').slice(1)
        let thetime = args1[1]
        if (!thetime) return message.reply('**Unable to execute the command**: ther is no time specified.')
        let member = message.mentions.members.first()
        if (!member) return message.reply('**Unable to execute the command**: You need to mention a user!')
        let muteRole = message.guild.roles.find(r => r.name === 'Muted')
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply('**Unable to execute the command**: i dont have the required permission to mute the member')
        if (!muteRole) {
            muteRole = message.guild.createRole({
              name: 'Muted',
              color: 'BLACK',
              position: 10,
              permissions: []
            })
        }
        message.guild.channels.map((channel, id) => {
          channel.overwritePermissions(muteRole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          })
        })
        if (member.roles.has(muteRole.id)) return message.reply('**Unable to execute the command**: the user is already muted')
        const embed = new Discord.RichEmbed()
          .setTitle('Member Mute')
          .setColor('RANDOM')
          .addField('User:', `${member}`)
          .addField('Guild:', `${message.guild.name}`)
          .setFooter('At', `${bot.user.displayAvatarURL}`)
          .setTimestamp()
          .addField('Action:', 'Mute')
          .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
          .addField('Time:', `${thetime}`)
        message.guild.channels.map((channel, id) => {
          channel.overwritePermissions(muteRole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          })
        })
        const embed1 = new Discord.RichEmbed()
          .setTitle('You have been MUTED')
          .setColor('RANDOM')
          .setTimestamp()
          .setFooter('At', `${bot.user.displayAvatarURL}`)
          .setTimestamp()
          .addField('Action', 'Mute')
          .addField('Guild', `${message.guild.name}`)
          .addField('Moderator', `${message.author.username}#${message.author.discriminator}`)
          .addField('Time', thetime)

        const embed2 = new Discord.RichEmbed()
          .setTitle('You have been UNMUTED')
          .setColor('RANDOM')
          .setTimestamp()
          .setFooter('At', `${bot.user.displayAvatarURL}`)
          .setTimestamp()
          .addField('Action', 'UnMute')
          .addField('Guild', `${message.guild.name}`)
          .addField('Moderator', `${message.author.username}#${message.author.discriminator}`)

        member.addRole(muteRole)
        bot.users.find('id', message.mentions.members.first().id).send(embed1)
        message.channel.send(embed)

        setTimeout(function() {
          if (!member.roles.has(muteRole.id)) return
          member.removeRole(muteRole.id)
          bot.users.find('id', message.mentions.members.first().id).send(embed2)
          message.channel.send(member + ' has been unmuted.')
        }, ms(thetime))
    } catch(err) {
  console.log(err)
}
  }
}