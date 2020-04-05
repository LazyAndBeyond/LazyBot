module.exports = {
    "name": "cumsluts",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": true,
    "enabled": true,
    "cooldown": 2,
    "category": "Nsfw-Commands",
    "description": "the name should tell you everything",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    neko.nsfw.cumsluts().then(neko => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(neko.url);
      message.channel.send(embed);
    });
  }
}