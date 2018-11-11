module.exports = {
    "name": "settings",
    "dm": false,
    "args": false,
    "usage": "<prefix> <value> / <welcomeChannel> <value> / <welcomeMessage> <value> / <leaveMessage> <value> / <welcomeEnabled> <true/false> / starboardChannel <value> / starboardEnabled <true/false> / reset (resets all settings to default)",
    "aliases": [],
    "permLevel": "Admin",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Server-Moderation",
    "description": "Change the guild settings of the bot (use <prefix>help settings for more info)",
  execute(message, args, level) {
    const value = message.content.split(' ').splice(2).join(' ')
    const settings = message.client.databases.guilds.data[message.guild.id]
    const util = require('util')
    const key = args[0]
    
    if (!key) return message.channel.send(`[${settings.prefix}help settings for more info]\n${util.inspect(settings)}`, {code: 'coffeescript'})
    if (!settings[key]) return message.reply(`No such setting avaible, please refer to "${settings.prefix}help settings"} `)
    if (!value) message.reply('Please specify a new value')

    settings[key] = value
    message.reply(`**${key}** successfully changed to **${value}**`)
    try {
    switch (key) {
       /* case 'prefix' :
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
        
        case 'starboardEnabled' :
        if (!value) return message.reply('You need to add a value!')
        settings.starboardEnabled = value
        message.reply(`starboardEnabled successfully changed to **${value}**`)
        break
        */
        
        case 'reset' :
        const defaultSettings = message.client.settings.defaultSettings
        settings.prefix = defaultSettings.prefix
        settings.welcomeChannel = defaultSettings.welcomeChannel
        settings.welcomeMessage = defaultSettings.welcomeMessage
        settings.leaveMessage = defaultSettings.leaveMessage
        settings.welcomeEnabled = defaultSettings.welcomeEnabled
        settings.starboardChannel = defaultSettings.starboardChannel
        settings.starboardEnabled = defaultSettings.starboardEnabled
        message.reply(`Guild settings successfully resetted`)
        break 
      }
    } catch(e) {
      console.log(e)
    }
  }
}