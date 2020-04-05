module.exports = {
    "name": "woof",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": ["dogo"],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "Some dogs gifs and pics",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    neko.sfw.woof().then(woof => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(woof.url);
      message.channel.send(embed);
    });
  }
}