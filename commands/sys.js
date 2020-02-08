module.exports = {
    "name": "sys",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Custom-Commands",
    "description": "The informations about the bot usage and os.",
    execute(message, args, level) {
  const { version } = require('discord.js')
  const moment = require('moment')
  const bot =  message.client
  require('moment-duration-format')
  const duration = moment.duration(bot.uptime).format(' D [days], H [hrs], m [mins], s [secs]')
message.channel.send(`= STATISTICS =
• Full Name      ::   ${bot.user.username}
• ID             ::   ${bot.user.id}
• Owner          ::   @LazyAndBeyond#4763
• Admin          ::   @LoseJoe#5572
• Users          ::   ${bot.users.size.toLocaleString()}
• Servers        ::   ${bot.guilds.size.toLocaleString()}
• Channels       ::   ${bot.channels.size.toLocaleString()}
• CharacterLimit ::   ${2000}
• System Info    ::   ${process.platform}-${process.arch}
• Memory Usage   ::   ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime         ::   ${duration}
• Discord.js     ::   v${version}
• Node           ::   ${process.version}`, {code: 'autohotkey'})
    }
}