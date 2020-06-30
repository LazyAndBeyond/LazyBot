module.exports = {
    "name": "kemonomimi",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "Some kawaii kemonomimi",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    neko.sfw.kemonomimi().then(kemonomimi => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(kemonomimi.url);
      message.channel.send(embed);
    });
  }
}