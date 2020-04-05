module.exports = {
    "name": "owoify",
    "dm": false,
    "args": true,
    "usage": "<text>",
    "aliases": ["owo"],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "owoify your message",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();
    const owoable = message.content.split(' ').slice(1).join(' ')

    neko.sfw.OwOify({text: owoable}).then(owo => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setDescription(owo.owo);
      message.channel.send(embed);
    });
  }
}