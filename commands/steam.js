module.exports = {
    "name": "steam",
    "dm": false,
    "args": true,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Custom-Commands",
    "description": "Check any game in steam.",
    async execute(message, args, level) {
  try {
  const Discord = require('discord.js')
  const snekfetch = require('snekfetch')
  const query  = message.content.split(/\s+/g).slice(1).join(' ')
  const { body } = await snekfetch
        .get('https://store.steampowered.com/api/storesearch')
        .query({
          cc: 'us',
          l: 'en',
          term: query
        })
  if (!body.total) return message.channel.send(`No results found for **${query}**!`)

  const current = body.items[0].price ? body.items[0].price.final / 100 : 0.00
  const original = body.items[0].price ? body.items[0].price.initial / 100 : 0.00
  const price = current === original ? `$${current}` : `~~$${original}~~ $${current}`

  const embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setAuthor(body.items[0].name, 'https://i.imgur.com/vL8b4D5.png')
        .setURL(`http://store.steampowered.com/app/${body.items[0].id}`)
        .setImage(body.items[0].tiny_image)
        .setDescription(`• **Price:** ${price} **score:** ${body.items[0].metascore || '`N/A`'}`)
  return message.channel.send({ embed })
  } catch(err) {
    message.reply('and error accured while tryng to seach the game')
  }
    }
}