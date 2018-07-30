const Discord = require('discord.js')

module.exports = (Bot, settings) => {
  
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
  
  Bot.emit('message')
  
  var presence = { //Setting the presence
    game: {
      name: `${Bot.config.prefix}help | ${Bot.guilds.size} servers`,
      type: 3
    }
  }

  Bot.user.setPresence(presence)
  
  //data base crap
  
  var db = Bot.databases.guilds
  var data = db.read()
  
  Bot.guilds.map(g => {

	if(!data.hasOwnProperty(g.id)) {
    
		data[g.id] = Bot.settings.defaultSettings

	  console.log('Creating a new guild database for ' + g.name)
    
	  } else {
      
		  console.log('Successfully Loaded a guild database: ' + g.name)
      
	  }

  })
  
  db.write(data)
  
}