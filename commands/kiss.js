module.exports = {
    "name": "kiss",
    "dm": false,
    "args": true,
    "usage": "<mention>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Fun-Commands",
    "description": "You can kiss someone through discord now!",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    const mention = message.mentions.users.first();
    if (!mention) return message.reply("But.. who do i kiss?");
    if (mention.id === message.author.id)
      return message.channel.send(
        `U can do that ur self`
      );

    neko.sfw.kiss().then(kiss => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(kiss.url);
      message.channel.send(embed);
    });
  }
}