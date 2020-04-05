module.exports = {
    "name": "holo",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "Some holo gifs and pics",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    neko.sfw.holo().then(holo => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(holo.url);
      message.channel.send(embed);
    });
  }
}