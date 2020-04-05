module.exports = {
  name: "baka",
  dm: false,
  args: false,
  usage: "",
  aliases: [],
  permLevel: "User",
  nsfw: false,
  enabled: true,
  cooldown: 2,
  category: "Fun-Commands",
  description: "Anime girls saying baka",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    const mention = message.mentions.users.first();
    if (!mention) return message.reply("But.. whose the baka?");
    if (mention.id === message.author.id)
      return message.channel.send(
        `I do have to say i agree to that, but the stupid meaning of baka`
      );

    neko.sfw.baka().then(baka => {
      const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(baka.url);
      message.channel.send(embed);
    });
  }
};
