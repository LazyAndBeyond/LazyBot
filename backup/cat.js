module.exports = {
    "name": "cat",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "Returns a picture of a cat.",
    execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    neko.sfw.meow().then(meow => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(meow.url);
      message.channel.send(embed);
    });
    }
}