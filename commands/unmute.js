module.exports = {
    "name": "unmute",
    "dm": false,
    "args": true,
    "usage": "<mention>",
    "aliases": [],
    "permLevel": "Mod",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Server-Moderation",
    "description": "Unmutes a member (requires manage roles permission)",
  execute(message, args, level) {
    try{
    const bot = message.client
        const muteRole = message.guild.roles.find(r => r.name === 'Muted')
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply('**Unable to execute the command**: i dont have permission to unmute the user')
        if (!muteRole) {
            muteRole = message.guild.createRole({
              name: 'Muted',
              color: 'BLACK',
              position: 10,
              permissions: []
            })
        }
        message.guild.channels.map((channel, id) => {
          channel.overwritePermissions(muteRole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          })
        })
        let member = message.mentions.members.first()
        if (!member) return message.channel.send('You need to mention a user!')
        if (!member.roles.has(muteRole.id)) return message.reply('**Unable to execute the command**: the user is not muted')

        member.removeRole(muteRole)
        bot.users.find('id', message.mentions.members.first().id).send(`You have been unmutted in **${message.guild.name}**.`)
        message.channel.send(member + ' has been unmuted.')
    } catch(err) {
  console.log(err)
} 
  }
}