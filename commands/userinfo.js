module.exports = {
    "name": "userinfo",
    "dm": false,
    "args": true,
    "usage": "<mention>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Costum-Commands",
    "description": "And you thought only FBI can get others informations ;D",
  execute(message, args, level) {
    try {
    const Discord = require('discord.js')
    const bot = message.client
      const user = message.mentions.users.first()
      const member1 = message.mentions.members.first()
      if (!user) return message.channel.send('**Unable to execute the command**:you need to mention a user!')
      var game = user.presence.game
      if (!game) { 
        game = 'Not playing anything'
      var embed = new Discord.RichEmbed()
        .setAuthor(message.author.username + ' requested user info of ' + user.username)
        .setDescription(`**${user.username}**'s Profile Info's`)
        .setColor('RANDOM')
        .setThumbnail(user.displayAvatarURL)
        .addField('Game', `**${game}**`)
        .addField('Statu:', `**${message.member.presence.status}**`)
        .addField('Full Username:', `**${user.username}**`)
        .addField('ID:', `**${user.id}**`)
        .addField('Joined At:', `**${member1.joinedAt}**`)
        .addField('Created At:', `**${user.createdAt}**`)
        .setFooter('Requested at: ', bot.user.displayAvatarURL)
        .setTimestamp()

      message.channel.send({embed:embed})
      } else {
      game = user.presence.game.name
      var embed = new Discord.RichEmbed()
        .setAuthor(message.author.username + ' requested user info of ' + user.username)
        .setDescription(`**${user.username}**'s Profile Infos`)
        .setColor('RANDOM')
        .setThumbnail(user.displayAvatarURL)
        .addField('Statu:', `**${user.presence.status}**`, true)
        .addField('Game', `**${game}**`, true)
        .addField('Full Username:', `**${user.username}**`, true)
        .addField('ID:', `**${user.id}**`, true)
        .addField('Created At:', `**${user.createdAt}**`, true)
        .addField('Joined At:', `**${user.joinedAt}**`, true)
        .setFooter('Requested at: ', bot.user.displayAvatarURL)
        .setTimestamp()

      message.channel.send({embed:embed})
      }
    } catch (err) {
      console.log(err)
    }
  }
}