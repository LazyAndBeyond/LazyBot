module.exports = {
    "name": "nekogif",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": ["ng"],
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

    neko.sfw.nekoGif().then(nekoGif => {
      const embed = new Discord.RichEmbed()
        .setTitle(`NekoGif`)
        .setColor("RANDOM")
        .setImage(nekoGif.url);
      message.channel.send(embed);
    });
  }
}