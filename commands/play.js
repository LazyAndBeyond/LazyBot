module.exports = {
    "name": "play",
    "dm": false,
    "args": true,
    "usage": "<song-name> || <youtube url>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Music-Commands",
    "description": "Plays music in your server.",
  execute(message, args, level) {
      if (!message.guild.voiceConnection) {
        if (!message.member.voiceChannel) return message.reply('You need to be in a voice channel')
        var chan = message.member.voiceChannel
        var permissions = chan.permissionsFor(message.client.user)
        if (!permissions.has('CONNECT')) return message.reply('I don\'t have permission to connect to the voice channel, please provide me the permissions or change to a public channel then try again.')
        if (!permissions.has('SPEAK')) return message.reply('I don\'t have permission to speak in the voice channel, please provide me the permissons or change to a public channel then try again.')
        chan.join()
      }
      let suffix = message.content.split(' ').slice(1).join(' ')
      if (!suffix) return message.channel.send('You need to specify a song link or a song name!')

      message.client.functions.play(message, message.client.functions.getQueue(message.guild.id), suffix)
  }
}