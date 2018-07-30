module.exports = {
    "name": "joke",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "And everybody thought that bots dont have sense of humor.",
    async execute(message, args, level) {
  const Discord = require('discord.js')
  const snekfetch = require('snekfetch')

  const joke = await snekfetch
    .get('https://icanhazdadjoke.com/')
    .set('Accept', 'application/json')

  try {
    const embed = new Discord.RichEmbed()
        .setDescription(joke.body.joke)
        .setColor('RANDOM')
    return message.channel.send({ embed })
  } catch (err) {
    console.log(err)
    return message.channel.send('No more jokes for you....')
  }
    }
}