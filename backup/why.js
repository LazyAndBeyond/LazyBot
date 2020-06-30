module.exports = {
    "name": "why",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "But why?",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    neko.sfw.why().then(why => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setDescription(why.why);
      message.channel.send(embed);
    });
  }
}