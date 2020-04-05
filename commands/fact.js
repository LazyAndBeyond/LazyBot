module.exports = {
    "name": "fact",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "facts don't care about your feelings",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    neko.sfw.fact().then(fact => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setDescription(fact.fact);
      message.channel.send(embed);
    });
  }
}