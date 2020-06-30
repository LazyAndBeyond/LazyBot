//${message.author.username}#${message.author.discriminator}
module.exports = {
    "name": "review",
    "dm": false,
    "args": true,
    "usage": "<args>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Support-Commands",
    "description": "Drope all the bugs reports and the hate you have on my owner with this command.",
  execute(message, args, level) {
    let args1 = message.content.split(' ').splice(1).join(' ')
    const bot = message.client
    let cid = bot.channels.get('358202949844992004')
    const Discord = require('discord.js')
    var embed =  new Discord.RichEmbed()
    .setTitle('Bot review')
    .setColor('RANDOM')
    .addField('Guild', message.guild.name)
    .addField('By', `${message.author.username}#${message.author.discriminator} (id: ${message.author.id})`)
    .addField('Content', args1)
    .setFooter('Feedback been sent: ', bot.user.displayAvatarURL)
    .setTimestamp()
    
    cid.send(embed)
    message.reply('Thank you for your feedback!')
  }
}