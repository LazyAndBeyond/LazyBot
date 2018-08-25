module.exports = {
    "name": "anime",
    "dm": false,
    "args": true,
    "usage": "<anime-name>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Custom-Commands",
    "description": "Search your favorite animes with the bot while its possible!",
  execute(message, args, level) {
  const Discord = require('discord.js')
  const Kitsu = require('kitsu.js')
  const kitsu = new Kitsu()
  const search = message.content.split(/\s+/g).slice(1).join(' ')

  kitsu.searchAnime(search).then(result => {
    if (result.length === 0) {
      return message.channel.send(`No results found for **${search}**!`)
    }
    const anime = result[0]
    const embed = new Discord.RichEmbed()
    .setTitle(`Anime results for **${search}** .`)
    .setAuthor(`${anime.titles.english ? anime.titles.english : search} | ${anime.showType}`, anime.posterImage.original)
    .setDescription(anime.synopsis.replace(/<[^>]*>/g, '').split('\n')[0])
    .setColor('RANDOM')
    .addField(`Anime Info's:`, `**Japanese Name:** ${anime.titles.romaji}\n**Age Rating:** ${anime.ageRating}\n**NSFW:** ${anime.nsfw ? 'Yes' : 'No'}`, true)
    .addField('Anime Stats:', `**Average Rating:** ${anime.averageRating}\n**Rating Rank:** ${anime.ratingRank}\n**Popularity Rank:** ${anime.popularityRank}`, true)
    .addField('Anime Status', `• **Episodes:** ${anime.episodeCount ? anime.episodeCount : 'N/A'}\n• **Start Date:** ${anime.startDate}\n• **End Date:** ${anime.endDate ? anime.endDate : 'Still airing'}`, true)
    .setImage(anime.posterImage.original)
    message.channel.send(embed)
  })
  }
}