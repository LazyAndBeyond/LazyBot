module.exports = {
    "name": "foxGirl",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": ["fox", "fg"],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "Some kawaii neko girls for the anime lovers out there.",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    neko.sfw.foxGirl().then(fox => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(fox.url);
      message.channel.send(embed);
    });
  }
}