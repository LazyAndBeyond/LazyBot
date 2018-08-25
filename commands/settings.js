module.exports = {
    "name": "settings",
    "dm": false,
    "args": true,
    "usage": "<prefix/welcomeChannel/welcomeMessage/leaveMessage/welcomeEnabled>",
    "aliases": [],
    "permLevel": "Admin",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Server-Moderation",
    "description": "Change the guild settings of the bot (If you want to reset it use <prefix>settings reset)",
  execute(message, args, level) {
    const value = message.content.split(' ').splice(2).join(' ')
    const settings = message.client.databases.guilds.data[message.guild.id]
    const util = require('util')
    
    try {
    switch (args[0]) {
        case 'prefix' :
        if (!value) return message.reply('You need to add a value!')
        settings.prefix = value
        message.reply(`Prefix successfully changed to **${value}**`)
        break
        
        case 'welcomeChannel' :
        if (!value) return message.reply('You need to add a value!')
        settings.welcomeChannel = value
        message.reply(`WelcomeChannel successfully changed to **${value}**`)
        break
        
        case 'welcomeMessage' :
        if (!value) return message.reply('You need to add a value!')
        settings.welcomeMessage = value
        message.reply(`welcomeMessage successfully changed to **${value}**`)
        break
        
        case 'leaveMessage' :
        if (!value) return message.reply('You need to add a value!')
        settings.leaveMessage = value
        message.reply(`leaveMessage successfully changed to **${value}**`)
        break
        
        case 'welcomeEnabled' :
        if (!value) return message.reply('You need to add a value!')
        settings.welcomeEnabled = value
        message.reply(`welcomeEnabled successfully changed to **${value}**`)
        break
        
        case 'get' :
        message.channel.send(util.inspect(settings), {code: 'coffeescript'})
        break
        
        case 'reset' :
        const defaultSettings = message.client.settings.defaultSettings
        settings.prefix = defaultSettings.prefix
        settings.welcomeChannel = defaultSettings.welcomeChannel
        settings.welcomeMessage = defaultSettings.welcomeMessage
        settings.leaveMessage = defaultSettings.leaveMessage
        settings.welcomeEnabled = defaultSettings.welcomeEnabled
        message.reply(`Guild settings successfully resetted`)
        break
      }
    } catch(e) {
      console.log(e)
    }
  }
}