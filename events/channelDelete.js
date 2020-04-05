const { RichEmbed } = require("discord.js");
const db = require("../modules/MongoDB.js");

module.exports = (client, channel) => {
  db.findOne(
    {
      guildID: channel.guild.id
    },
    (err, data) => {
      if (!data) return;
      if (err) console.log(err);

      if (data.modLog === false) return;

      if (channel.type !== "text") return;
      const modLogChannel = channel.guild.channels.find(
        channel => channel.name === data.logChannel
      );
      if (!modLogChannel) return;

      modLogChannel.send(
        new RichEmbed()
          .setAuthor("Channel Deleted", client.user.displayAvatarURL)
          .addField("Channel Name", "#" + channel.name)
          .addField("ID", channel.id)
          .setTimestamp()
          .setColor("BLUE")
      );
    }
  );
};
