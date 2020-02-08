const {
    RichEmbed
} = require('discord.js');
const db = require('../modules/MongoDB.js')

module.exports = (client, oldRole, newRole) => {
    db.findOne({
        guildID: newRole.guild.id
    }, (err, data) => {

        if (!data) return
        if (err) console.log(err)
        if (data.modLog === false) return

        const modLogChannel = newRole.guild.channels.find(channel => channel.name === data.logChannel)

        if (!modLogChannel) return

        if (oldRole.name == newRole.name && oldRole.permissions == newRole.permissions && oldRole.mentionable == newRole.mentionable && oldRole.hoist == newRole.hoist) return;

        let logEmbed = new RichEmbed()
            .setAuthor("Role Updated", client.user.displayAvatarURL)
            .addField("ID", oldRole.id)
            .setTimestamp()
            .setColor('BLUE');

        if (oldRole.name !== newRole.name)
            logEmbed.addField("Name (changed)", "~~" + oldRole.name + "~~\n**" + newRole.name + "**");
        else
            logEmbed.addField("Name (not changed)", oldRole.name);
        
        if (oldRole.permissions !== newRole.permissions)
            logEmbed.addField("Permissions (changed)", "~~[Old Permissions](https://discordapi.com/permissions.html#" + oldRole.permissions + ")~~\n" + "[Click here](https://discordapi.com/permissions.html#" + newRole.permissions + ")")
        else
            logEmbed.addField("Permissions (not changed)", "[New Permissions](https://discordapi.com/permissions.html#" + oldRole.permissions + ")");
        
        if (oldRole.mentionable !== newRole.mentionable)
            logEmbed.addField("Mentionable (changed)", newRole.mentionable);
        else
            logEmbed.addField("Mentionable (not changed)", oldRole.mentionable);

        if (oldRole.hoist !== newRole.hoist)
            logEmbed.addField("Users Displayed Seperate (changed)", newRole.hoist);
        else
            logEmbed.addField("Users Displayed Seperate (not changed)", newRole.hoist);

        modLogChannel.send(logEmbed);
    })
}