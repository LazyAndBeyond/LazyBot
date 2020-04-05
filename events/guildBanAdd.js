const { RichEmbed } = require("discord.js");
const db = require("../modules/MongoDB.js");

module.exports = (client, guild, user) => {
  db.findOne(
    {
      guildID: guild.id
    },
    (err, data) => {
      if (!data) return;
      if (err) console.log(err);
      if (data.modLog === false) return;
      const modLogChannel = guild.channels.find(
        channel => channel.name === data.logChannel
      );
      if (!modLogChannel) return;

      modLogChannel.send(
        new RichEmbed()
          .setAuthor("Member Banned", client.user.displayAvatarURL)
          .addField("Username", user.tag)
          .addField("ID", user.id)
          .setTimestamp()
          .setColor("BLUE")
      );
    }
  );
};
