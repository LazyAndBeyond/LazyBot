/*module.exports = (Bot, member) => {
        const mongoose = require('mongoose')
        mongoose.set('useFindAndModify', false)
        const database = require('../modules/MongoDB.js')
        mongoose.connect(`${process.env.MONGO}`, {
            useNewUrlParser: true,
        })
  
  
  
  
  const guild = member.guild
  const settings = Bot.databases.guilds.data[guild.id]
  const welcomeChannel = guild.channels.find(channel => channel.name === settings.welcomeChannel)
  const welcomeMessage = settings.welcomeMessage.replace("{{user}}", `<@${member.user.id}>`)

  if (!welcomeChannel) return 
  if (settings.welcomeEnabled !== "true") return

  welcomeChannel.send(welcomeMessage).catch(console.error)
}*/

module.exports = (Bot, member) => {
    const mongoose = require('mongoose')
    const database = require('../modules/MongoDB.js')

   /* mongoose.connect(`${process.env.MONGO}`, {
        useNewUrlParser: true,
        useFindAndModify: false,
    })*/

    database.findOne({
        guildID: member.guild.id
    }, (err, data) => {
        if (!data) return

        const part = data.welcomeMessage.replace('{{user}}', `<@${member.user.id}>`)
        const welcomeMessage = part.replace('{{guild}}', `**${member.guild.name}**`)
        const welcomeChannel = member.guild.channels.find(channel => channel.name === data.welcomeChannel)

        if (!welcomeChannel) return
        if (data.welcomeEnabled !== true) return

        welcomeChannel.send(welcomeMessage).catch(console.error)

    })
}