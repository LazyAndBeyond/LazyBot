module.exports = {
  name: "poke",
  dm: false,
  args: false,
  usage: "",
  aliases: [],
  permLevel: "User",
  nsfw: false,
  enabled: true,
  cooldown: 2,
  category: "Fun-Commands",
  description: "Basically poke anyone you like",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    const mention = message.mentions.users.first();
    if (!mention) return message.reply("But.. who do i poke?");
    if (mention.id === message.author.id)
      return message.channel.send(
        `U can do that ur self`
      );

    neko.sfw.poke().then(poke => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(poke.url);
      message.channel.send(embed);
    });
  }
};
