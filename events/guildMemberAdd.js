module.exports = (Bot, member) => {
  const guild = member.guild
  const settings = Bot.databases.guilds.data[guild.id]
  const welcomeChannel = guild.channels.find(channel => channel.name === settings.welcomeChannel)
  const welcomeMessage = settings.welcomeMessage.replace("{{user}}", `<@${member.user.id}>`)

  if (!welcomeChannel) return 
  if (settings.welcomeEnabled !== "true") return

  welcomeChannel.send(welcomeMessage).catch(console.error)
}