module.exports = {
  "name": "math",
  "dm": false,
  "args": true,
  "usage": "<num1> <+, -, /, *> <num2>",
  "aliases": ["maff"],
  "permLevel": "User",
  "nsfw": false,
  "enabled": true,
  "cooldown": 2,
  "category": "Custom-Commands",
  "description": "Quick maths",
  execute(message, args, level) {
    const db = require('../modules/MongoDB.js')
    const Discord = require('discord.js')
    const bot = message.client

    db.findOne({
      guildID: message.guild.id
    }, (err, data) => {
      if (!data) data = {};
      let prefix = data.prefix
      if (!prefix) prefix = 'b$'

      let rb = '```'
      const cmd = message.content.toLowerCase().slice(prefix.length + 5)
      if (!cmd) return message.reply('Please provide an equation')
      try {
        var result = eval(cmd.match(/[-0-9^\^()+*/.]/g).toString().replace(/,/g, "").replace(/\^/g, "**"))
        var result = Math.round(result * 1000000000000) / 1000000000000
      } catch (err) {
        message.channel.send(`${rb}js\nTypeError: User unable to abuse the math command ¯\_(ツ)_/¯\n${rb}`)
        return
      }

      const embed = new Discord.RichEmbed()
        .setTitle('QUICK MATHS')
        .setColor('RANDOM')
        .setThumbnail(bot.user.diplayAvatarURL)
        .addField(`here's your Answer:`, `${rb}js\n${result}\n${rb}`)
        .setFooter('Requested at: ', bot.user.displayAvatarURL)
        .setTimestamp()

      message.channel.send(embed)
    })
  }
}