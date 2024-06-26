const rm = require('discord.js-reaction-menu')
module.exports = {
  "name": "help",
  "dm": false,
  "args": false,
  "usage": "<command name>",
  "aliases": ["commands", "cmds"],
  "permLevel": "User",
  "nsfw": false,
  "enabled": true,
  "cooldown": 5,
  "category": "Support-Commands",
  "description": "Filters all the avaible commands of the client.",
  execute(message, args, level) {
    const db = require('../modules/MongoDB.js')

    db.findOne({
      guildID: message.guild.id
    }, (err, data) => {
      if(!data) data = {};
      let prefix = data.prefix 
      if (!prefix) prefix = 'b$'
      var Bot = message.client;

      if (!args[0]) {
        const config = Bot.config
        const myCommands = Bot.commands
        const commandNames = myCommands.keyArray()
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0)
        let currentCategory = ''
	let pages = []

        let output = ``

        const sorted = myCommands.array().sort((p, c) => p.category > c.category ? 1 : p.name > c.name && p.category === c.category ? 1 : -1)
        sorted.forEach(c => {
          const cat = c.category
          if (currentCategory !== cat) {
	    output += "\n```"
	    pages.push(output)
	    output = "```asciidoc\n= Command List =\n\n[Use ${prefix}help <CommandName> for details]\n"
            output += `\u200b\n== ${cat} ==\n`
            currentCategory = cat
          }
          output += `${prefix}${c.name}${' '.repeat(longest - c.name.length)} :: ${c.description}\n`
        })
	pages.shift()
        new rm.menu(message.channel, message.author.id, pages, 60000)
      } else {
        var command = args[0]
        if (Bot.commands.has(command)) {
          command = Bot.commands.get(command)
          message.channel.send(`= ${command.name} = \n${command.description}\nUsage:: ${prefix}${command.name} ${command.usage}\nAliases:: ${command.aliases.join(', ')}\n= ${command.name} =`, {
            code: 'asciidoc'
          })
        }
      }
    })
  }
}