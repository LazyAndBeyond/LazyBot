module.exports = {
    "name": "stop",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Music-Commands",
    "description": "Stops the music and leaves the voice channel.",
  async execute(message, args, level) {
    const voiceConnection = message.client.voiceConnections.find(val => val.channel.guild.id === message.guild.id)
    if (voiceConnection === null) return message.reply('**No music being played.**')
    const dispatcher = voiceConnection.player.dispatcher
    let chan = message.member.voiceChannel
    let msg = 'Leaving the channel...'
    if (dispatcher) msg = 'Stopping music...'
    if (dispatcher) await dispatcher.end()
    await chan.leave()
    message.channel.send(msg)
  }
}