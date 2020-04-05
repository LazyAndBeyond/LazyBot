module.exports = {
  name: "hug",
  dm: false,
  args: false,
  usage: "<mention>",
  aliases: [],
  permLevel: "User",
  nsfw: false,
  enabled: true,
  cooldown: 2,
  category: "Fun-Commands",
  description:
    "For people that really like to hug others and not get called weirdos or get beaten up.",
  execute(message, args, level) {
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const client = require("nekos.life");
    const neko = new client();

    const mention = message.mentions.users.first();
    if (!mention) return message.reply("But.. hug who?");
    if (mention.id === message.author.id)
      return message.channel.send(
        `OOF didn't know you're that lonely... but don't worry, i will hug you myself`
      );

    neko.sfw.hug().then(hug => {
      const embed = new Discord.RichEmbed()
        .setTitle(`Huuuuug`)
        .setColor("RANDOM")
        .setImage(hug.url);
      message.channel.send(embed);
    });
  }
};
