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
    var Bot = message.client;
    if (!args[0]) {
   const config = Bot.config
   const myCommands =  Bot.commands
   const commandNames = myCommands.keyArray()
   const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0)
   let currentCategory = ''
   
   let output = `= Command List =\n\n[Use ${config.prefix}help <CommandName> for details]\n`

   const sorted = myCommands.array().sort((p, c) => p.category > c.category ? 1 : p.name > c.name && p.category === c.category ? 1 : -1)
   sorted.forEach(c => {
      const cat = c.category
      if (currentCategory !== cat) {
        output += `\u200b\n== ${cat} ==\n`
        currentCategory = cat
      }
      output += `${config.prefix}${c.name}${' '.repeat(longest - c.name.length)} :: ${c.description}\n`
    })
    message.channel.send(output, {code: 'asciidoc', split: { char: '\u200b' }})
  } else { 
    var command = args[0]
    if (Bot.commands.has(command)) {
      command = Bot.commands.get(command)
      message.channel.send(`= ${command.name} = \n${command.description}\nUsage:: ${Bot.config.prefix}${command.name} ${command.usage}\nAliases:: ${command.aliases.join(', ')}\n= ${command.name} =`, {code: 'asciidoc'})
    }
  }
  }
}