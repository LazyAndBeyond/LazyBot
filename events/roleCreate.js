const { RichEmbed } = require("discord.js");
const db = require("../modules/MongoDB.js");

module.exports = (client, role) => {
  db.findOne(
    {
      guildID: role.guild.id
    },
    (err, data) => {
      if (!data) return;
      if (err) console.log(err);

      if (data.modLog === false) return;
      const modLogChannel = role.guild.channels.find(
        channel => channel.name === data.logChannel
      );
      if (!modLogChannel) return;

      modLogChannel.send(
        new RichEmbed()
          .setAuthor("Role Created", client.user.displayAvatarURL)
          .addField("Role Name", role)
          .addField(
            "Permissions",
            "[Click here](https://discordapi.com/permissions.html#" +
              role.permissions +
              ")"
          )
          .addField("ID", role.id)
          .setTimestamp()
          .setColor("BLUE")
      );
    }
  );
};
