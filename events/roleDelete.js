const {
    RichEmbed
} = require('discord.js');
const db = require('../modules/MongoDB.js')

module.exports = (client, role) => {
    db.findOne({
        guildID: role.guild.id
    }, (err, data) => {
        const modLogChannel = role.guild.channels.find(channel => channel.name === data.logChannel)

        if (!data) return
        if (err) console.log(err)
        if (data.modLog === false) return
        if (!modLogChannel) return

        modLogChannel.send(new RichEmbed()
            .setAuthor("Role Deleted", client.user.displayAvatarURL)
            .addField("Role Name", role.name)
            .addField("ID", role.id)
            .setColor('BLUE'));
    })
}