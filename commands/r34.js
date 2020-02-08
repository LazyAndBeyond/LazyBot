module.exports = {
    "name": "r34",
    "dm": false,
    "args": false,
    "usage": "<query>",
    "aliases": ["rule34"],
    "permLevel": "User",
    "nsfw": true,
    "enabled": true,
    "cooldown": 2,
    "category": "Nsfw-Commands",
    "description": "Seach in rule34...",
  execute(message, args, level) {
    if (message.content.toUpperCase().includes('LOLI') && message.author.id !== message.client.config.owner_id || message.content.toUpperCase().includes('GORE')) return message.channel.send('Sorry but those stuff are not allowed iven NSFW channels....')
  const Discord = require('discord.js')
  const booru = require('booru')
    var search = message.content.split(/\s+/g).slice(1).join(' ')
    booru.search('r34', [search], { limit: 1, random: false })
            
            .then(images => {
              for (let image of images) {
                const embed = new Discord.RichEmbed()
                        .setAuthor(`Rule34 ${search}`)
                        .setDescription(`[Image URL](${image.common.file_url})`)
                        .setImage(image.common.file_url)
                        .setColor('RANDOM')
                return message.channel.send({ embed })
              }
            }).catch(err => {
              if (err.name === 'booruError') {
                return message.channel.send(`No results found for **${search}**!`)
              } else {
                console.log(err)
                return message.channel.send(`No results found for **${search}**!`)
              }
            })
  }
}