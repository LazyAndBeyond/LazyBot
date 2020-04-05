module.exports = {
    "name": "lewd",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": ["lewdneko"],
    "permLevel": "User",
    "nsfw": true,
    "enabled": true,
    "cooldown": 2,
    "category": "Nsfw-Commands",
    "description": "Same as neko command but the lewd version ;P",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    neko.nsfw.neko().then(neko => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(neko.url);
      message.channel.send(embed);
    });
  }
}