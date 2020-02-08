/*module.exports = (Bot, member) => {
  const guild = member.guild
  const settings = Bot.databases.guilds.data[guild.id]
  const welcomeChannel = guild.channels.find(channel => channel.name === settings.welcomeChannel)
  const leaveMessage = settings.leaveMessage.replace("{{user}}", `**${member.user.username}**`)
  
  if (!welcomeChannel) return 
  if (settings.welcomeEnabled !== "true") return

  welcomeChannel.send(leaveMessage).catch(console.error)
}*/

module.exports = (Bot, member) => {
    const mongoose = require('mongoose')
    const database = require('../modules/MongoDB.js')

    /*mongoose.connect(`${process.env.MONGO}`, {
        useNewUrlParser: true,
        useFindAndModify: false,
    })*/

    database.findOne({
        guildID: member.guild.id
    }, (err, data) => {
        if (!data) return

        const leaveMessage = data.leaveMessage.replace("{{user}}", `**${member.user.username}**`)
        const welcomeChannel = member.guild.channels.find(channel => channel.name === data.welcomeChannel)

        if (!welcomeChannel) return
        if (data.welcomeEnabled !== true) return

        welcomeChannel.send(leaveMessage).catch(console.error)

    })
}