module.exports = {
    "name": "eval",
    "dm": false,
    "args": true,
    "usage": "<code>",
    "aliases": ["evaluate"],
    "permLevel": "Bot Admin",
    "nsfw": false,
    "enabled": true,
    "cooldown": 5,
    "category": "Owner / Admins",
    "description": "evaluate scripts",
    execute(message, args, level) {
        const bot = message.client
        const then = Date.now()
        const Discord = require('discord.js')
        try {
          let code = message.content.split(' ').splice(1).join(' ')
          let result = eval(code)
          let embed = new Discord.RichEmbed()
            .setTitle('EVAL')
            .setColor('RANDOM')
            .addField(':inbox_tray: Input', '```js\n+ ' + code + '```')
            .addField(':outbox_tray: Output', '```diff\n+ ' + result + '```')
          message.channel.send(embed)
        } catch (err) {
          let code = message.content.split(' ').splice(1).join(' ')
          let embederr = new Discord.RichEmbed()
            .setTitle('ERROR!!')
            .setColor('RANDOM')
            .addField(':inbox_tray: Input', '```js\n+ ' + code + '```')
            .addField(':outbox_tray: Output', '```diff\n- ' + err + '```')
          message.channel.send(embederr)
        }
    }
}