const Discord = require('discord.js')
const activities_list = [
    "the developers console",
    "you and the crew", 
    "JavaScript errors",
    "some dank codes",
    "guild leaves...",
    "over you",
    "USERS!",
    "Senpai's!",
    "Tetsuya!"
    ]
const statues = activities_list[Math.round(Math.random() * (activities_list.length - 1))]

module.exports = (Bot) => {
  var presence = { //Setting the presence
      game: {
      //name: `${Bot.config.prefix}help | ${Bot.guilds.size} servers`,
      name: `${statues} | b$help`,
      type: 3
    }
  }
setInterval(() => {
  Bot.user.setPresence(presence)
  }, 10000)
  
  var msg = `
------------------------------------------------------
> Logging in...
------------------------------------------------------
Logged in as ${Bot.user.username} [ID ${Bot.user.id}]
On ${Bot.guilds.size} servers!
${Bot.channels.size} channels and ${Bot.users.size} users cached!
Bot is logged in and ready to play some tunes!
LET'S GO!
------------------------------------------------------`
      
 console.log(msg)
  
  //Database Loader
  
  var db = Bot.databases.guilds
  var data = db.data //Changed db.read() to db.data so you can make changes to the variable
  
  Bot.guilds.map(g => {

	if(!data.hasOwnProperty(g.id)) {
    
		data[g.id] = Bot.settings.defaultSettings

	  console.log('Creating a new guild database for ' + g.name)
    
	  } else {
      
		  console.log('Successfully Loaded a guild database: ' + g.name)
      
	  }

  })
  
  
//discord bot list poster
setInterval(() => {
const snekfetch = require('snekfetch');
const key = 'key';

snekfetch.post(`https://discordbots.org/api/bots/${Bot.user.id}/stats`)
    .set('Authorization', key)
    .send({ server_count: Bot.guilds.size })
    .catch((e) => console.error(e));
}, 1800000);
  
  
  
  
}