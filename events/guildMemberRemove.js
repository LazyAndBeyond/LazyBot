module.exports = (Bot, member) => {
  const guild = member.guild
  const settings = Bot.databases.guilds.data[guild.id]
  const welcomeChannel = guild.channels.find("name", settings.welcomeChannel)
  const leaveMessage = settings.leaveMessage.replace("{{user}}", `**${member.user.username}**`)

  guild.channels.find("name", settings.welcomeChannel).send(leaveMessage).catch(console.error)
}