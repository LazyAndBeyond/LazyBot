module.exports = (Bot, guild) => {
  const time = new Date()
  Bot.channels.get('358200987527413760').send(`[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Joined: "${guild.name}" (id: "${guild.id}"). \nWith: "${guild.memberCount}" members!`, {code: 'asciidoc'})
  try {
  const defaultChannel = guild.channels.find(channel => channel.name === 'general')
  if (!defaultChannel) {
    guild.owner.send(`Hello!\nThank you for having me in your server **${guild.owner.user.username}**\nTo check my command use **b$help**\nIf you have any problem or you fund a bug in the bot please use **b$review** command with giving every detail about, such as what command and how to trigger the bug or just visit the support server and ask for help there **https://discord.gg/ayFufuF**\nAnd if you don't mind, try upvoting me in this website **https://discordbots.org/bot/358198916539482112** so more people get to know me!\nThank you for supporting me!`)
  } else {
    defaultChannel.send(`Hello!\nThank you for having me in your server **${guild.owner.user.username}**\nTo check my command use **b$help**\nIf you have any problem or you fund a bug in the bot please use **b$review** command with giving every detail about, such as what command and how to trigger the bug or just visit the support server and ask for help there **https://discord.gg/ayFufuF**\nAnd if you don't mind, try upvoting me in this website **https://discordbots.org/bot/358198916539482112** so more people get to know me!\nThank you for supporting me!`)
  }
  } catch(e) {
   console.log(e) 
  }
  
  const botper = guild.me.hasPermission('MANAGE_ROLES')
  if (!botper) return
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
  
  //discord bot list poster
setInterval(() => {
const snekfetch = require('snekfetch');
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1ODE5ODkxNjUzOTQ4MjExMiIsImJvdCI6dHJ1ZSwiaWF0IjoxNTM0NTQ0NTEyfQ.02o-P_EUBLI1ApiwHQmqVpngMo4eRwghCoLbKZTt7WU';

snekfetch.post(`https://discordbots.org/api/bots/${Bot.user.id}/stats`)
    .set('Authorization', key)
    .send({ server_count: Bot.guilds.size })
    .catch((e) => console.error(e));
}, 1800000);
  
  
  
  
}