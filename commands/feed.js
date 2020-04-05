module.exports = {
    "name": "feed",
    "dm": false,
    "args": true,
    "usage": "<mention>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "feed people online!",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    const mention = message.mentions.users.first();
    if (!mention) return message.reply("But.. who do i feed?");
    if (mention.id === message.author.id)
      return message.channel.send(
        `U can do that ur self`
      );

    neko.sfw.feed().then(feed => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(feed.url);
      message.channel.send(embed);
    });
  }
}