
const Discord = require('discord.js')

module.exports = (Bot, message) => {
  if (message.author.bot) return
  
  var config = Bot.config
	if(message.author.bot) return;
	if(!message.content.toLowerCase().startsWith(config.prefix.toLowerCase())) return;
	const args = message.content.slice(config.prefix.length).split(/\s+/);
	const CommandName = args.shift().toLowerCase();
  const level = Bot.functions.permLevel(message)
	const Command = Bot.commands.get(CommandName) || Bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(CommandName));
	if(!Command) return;
  
  //The user permission level code
    if (level < Bot.levelCache[Command.permLevel]) {
      return message.reply(`**Unable to execute the command**:you do not have permission to use this command.\nYour permission level is **${level}** (**${Bot.settings.permLevels.find(l => l.level === level).name}**)\nThis command requires level **${Bot.levelCache[Command.permLevel]}** (**${Command.permLevel}**)`)
  }

	//Checking for all the options

	if(!Command.enabled) return;
	if(!Command.dm) if(message.channel.type == "dm") return message.reply("**Unable to execute the command**:please use this command in a server.")
	if(Command.args) if(!args.length) return message.reply(`\nThe proper usage would be: \`${config.prefix}${Command.name} ${Command.usage}\`.`)
	if(Command.permissions) if(!message.member.permissions.has(parseInt(Command.permissions))) return message.channel.send(`Sorry ${message.author}, you do not have permission to run the \`${Command.name}\` command.`)
	if(Command.nsfw) if(!message.channel.nsfw) return message.channel.send(`${message.author}, **Unable to execute the command**:please set this channel to nsfw before executing this command!`)

	//Cooldowns

	if(!Bot.cooldowns.has(Command.name)) Bot.cooldowns.set(Command.name, new Discord.Collection());

	const timestamps = Bot.cooldowns.get(Command.name)
	const cooldownAmount = (Command.cooldown || 5) * 1000

	if(!timestamps.has(message.author.id)) {
		timestamps.set(message.author.id, Date.now())
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
	} else {
		//Time left message

		const expirtationTime = timestamps.get(message.author.id) + cooldownAmount

		if(Date.now() < expirtationTime) {
			const timeLeft = (expirtationTime - Date.now()) / 1000

			return message.channel.send(`${message.author}, Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${Command.name}\` command.`)

		}

	timestamps.set(message.author.id, Date.now())
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

	}

//Execute the command

Command.execute(message, args, level)

}





/*

MODULE.EXPORTS OPTIONS

name [string]
dm [boolean]
args [boolean]
usage [string]
aliases [array]
permissions [Integer]
nsfw [boolean]
enabled [boolean]
cooldown [Integer]
category [string]
execute [function]

*/