module.exports = {
    "name": "pause",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Music-Commands",
    "description": "Pauses the music",
  async execute(message, args, level) {
    const voiceConnection = message.client.voiceConnections.find(val => val.channel.guild.id === message.guild.id)
    if (voiceConnection === null) return message.reply('**No music being played.**')
    const dispatcher = voiceConnection.player.dispatcher
    if (dispatcher.paused) return message.reply('Music is already paused')
    message.channel.send('_**Pausing music...**_')
    await dispatcher.pause()
  }
}