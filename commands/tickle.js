module.exports = {
  name: "tickle",
  dm: false,
  args: false,
  usage: "",
  aliases: [],
  permLevel: "User",
  nsfw: false,
  enabled: true,
  cooldown: 2,
  category: "Fun-Commands",
  description: "Tickle other people",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    const mention = message.mentions.users.first();
    if (!mention) return message.reply("But.. who do i tickle?");
    if (mention.id === message.author.id)
      return message.channel.send(
        `U can do that ur self`
      );

    neko.sfw.tickle().then(tickle => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(tickle.url);
      message.channel.send(embed);
    });
  }
};
