module.exports = {
    "name": "manga",
    "dm": false,
    "args": true,
    "usage": "<manga-name>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Costum-Commands",
    "description": "Search your favorite mangas with the bot while its possible!",
  execute(message, args, level) {
  const Discord = require('discord.js')
  const Kitsu = require('kitsu.js')
  const kitsu = new Kitsu()
  const search = message.content.split(/\s+/g).slice(1).join(' ')

  kitsu.searchManga(search).then(result => {
    if (result.length === 0) {
      return message.channel.send(`No results found for **${search}**!`)
    }
    const manga = result[0]
    const embed = new Discord.RichEmbed()
      .setTitle(`Manga results for **${search}** .`)
      .setAuthor(`${manga.titles.english}`, manga.posterImage.original)
      .setDescription(manga.synopsis.replace(/<[^>]*>/g, '').split('\n')[0])
      .setColor('RANDOM')
      .addField(`❯ Infos's`, `• **Japanese Name:** ${manga.titles.romaji}\n• **Age Rating:** ${manga.ageRating ? manga.ageRating : '`N/A`'}\n• **Chapters:** ${manga.chapterCount ? manga.chapterCount : '`N/A`'}`, true)
      .addField('❯ Stats', `• **Average Rating:** ${manga.averageRating ? manga.averageRating : '`N/A`'}\n• **Rating Rank:** ${manga.ratingRank ? manga.ratingRank : '`N/A`'}\n• **Popularity Rank:** ${manga.popularityRank ? manga.popularityRank : '`N/A`'}`, true)
      .addField('❯ Status', `• **Volumes:** ${manga.volumeCount ? manga.volumeCount : '`N/A`'}\n• **Start Date:** ${manga.startDate}\n• **End Date:** ${manga.endDate ? manga.endDate : 'Ongoing'}`, true)
      .setImage(manga.posterImage.original)
    message.channel.send(embed)
  })
  }
}