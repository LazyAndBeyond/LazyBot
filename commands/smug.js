module.exports = {
    "name": "smug",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "Smug anime girls",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    neko.sfw.smug().then(smug => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(smug.url);
      message.channel.send(embed);
    });
  }
}