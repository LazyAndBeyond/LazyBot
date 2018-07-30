module.exports = {
    "name": "setname",
    "dm": false,
    "args": true,
    "usage": "<name>",
    "aliases": [],
    "permLevel": "Bot Owner",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Owner / Admins",
    "description": "Allows me to change my name.",
  execute(message, args, level) {
    try {
    const bot = message.client
        const name = message.content.split(' ').splice(1).join(' ')
        console.log('Bot name got setted to ' + name + ' by ' + message.author.username)
        bot.user.setUsername(name)
        message.channel.send('✔ Username setted!')
    } catch (err) {
      console.log(err.code)
    }
  }
}