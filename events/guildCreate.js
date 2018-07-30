module.exports = (Bot, guild) => {
  const time = new Date()
  Bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Joined: "${guild.name}" (id: "${guild.id}"). \nWith: "${guild.memberCount}" members!`, {code: 'asciidoc'})
  
  const botper = guild.me.hasPermission('MANAGE_ROLES')
  if (!botper) return
  const DJ = guild.roles.find(r => r.name === 'DJ')
  if (!DJ) {
    guild.creatRole({
      name: 'DJ',
      color: 'BLUE',
      permissions: []
    })
  }
  const muteRole = guild.roles.find(r => r.name === 'Muted')
  if (!muteRole) {
    try {
      muteRole = guild.createRole({
        name: 'Muted',
        color: 'BLACK',
        permissions: []
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  guild.channels.map((channel, id) => {
    channel.overwritePermissions(muteRole.id, {
      SEND_MESSAGES: false,
      ADD_REACTIONS: false
    })
  })
  
  //Database crap
  
  var db = Bot.databases.guilds
  
  var data = db.read()
  
  data[guild.id] = Bot.settings.defaultSettings
  
  db.write(data)
  
  console.log("Writing part in db for " + guild.name)
  
  
  
  
}