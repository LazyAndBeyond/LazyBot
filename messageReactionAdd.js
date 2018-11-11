//not ready!!

module.exports = async (Bot, messageReaction, user) => {
  try {
  const Discord = require('discord.js')
  const message = messageReaction.message
  if (messageReaction.emoji.name !== '⭐') return message.reply('not a star')
  const settings = Bot.databases.guilds.data[message.guild.id]
  if (settings.starboardEnabled !== 'true') return
  const starChannel = message.guild.channels.find(c => c.name === settings.starboardChannel)
  if (!starChannel) return message.channel.send('Looks like there isn\'t any starboard channel, try adding one using ' + settings.prefix + 'settings starboardChannel <channelName>')
  //if (message.author.id === user.id) return
  
  const fetch = starChannel.fetchMessages({ limit: 100 })
  const stars = fetch.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(message.id))
  
  console.log("Made it past fetching")
  
  if (stars) {
    const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text)
    const foundStar = stars.embeds[0]
    const image = message.attachments.size > 0 ? this.extension(messageReaction, message.attachments.array()[0].url) : ''
    const embed = new Discord.RichEmbed()
    .setColor(foundStar.color)
    .setDescription(foundStar.description)
    .setAuthor(message.author.tag, message.author.displayAvatarURL)
    .setTimestamp()
    .setFooter(`⭐ ${parseInt(star[1])+1} | ${message.id}`)
    .setImage(image);
    
    const starMsg = starChannel.fetchMessage(stars.id)
    await starMsg.edit({ embed })
  } 
  if (!stars) {
    const image = message.attachments.size > 0 ? this.extension(messageReaction, message.attachments.array()[0].url) : ''
    if (image === '' && message.cleanContent.length < 1) return message.channel.send(`${user}, you cannot star an empty message.`)
    const embed = new Discord.RichEmbed()
    .setColor(15844367)
    .setDescription(message.cleanContent)
    .setAuthor(message.author.tag, message.author.displayAvatarURL)
    .setTimestamp(new Date())
    .setFooter(`⭐ 1 | ${message.id}`)
    .setImage(image)
     await starChannel.send({ embed })
  }
  } catch(e) {
   console.log(e.log) 
  }
  }