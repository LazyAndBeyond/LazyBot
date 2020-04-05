module.exports = {
  name: "slap",
  dm: false,
  args: false,
  usage: "",
  aliases: [],
  permLevel: "User",
  nsfw: false,
  enabled: true,
  cooldown: 2,
  category: "Fun-Commands",
  description: "Basically slap anyone you like",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    const mention = message.mentions.users.first();
    if (!mention) return message.reply("But.. who do i slap?");
    if (mention.id === message.author.id)
      return message.channel.send(
        `U can do that ur self`
      );

    neko.sfw.slap().then(slap => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(slap.url);
      message.channel.send(embed);
    });
  }
};
