module.exports = {
  "name": "skip",
  "dm": false,
  "args": false,
  "usage": "<number of songs to skip (optinal)>",
  "aliases": [],
  "permLevel": "User",
  "nsfw": false,
  "enabled": true,
  "cooldown": 2,
  "category": "Music-Commands",
  "description": "Skip the current music.",
  async execute(message, args, level) {
    try {
      let suffix = message.content.split(' ').slice(1).join(' ')
      const voiceConnection = message.client.voiceConnections.find(val => val.channel.guild.id === message.guild.id)
      if (voiceConnection === null) return message.reply('**No music being played.**')

      const queue = message.client.functions.getQueue(message.guild.id)
      if (queue.length === 1) return message.reply('Only 1 song is playing.')

      let toSkip = 1
      if (!isNaN(suffix) && parseInt(suffix) > 0) {
        toSkip = parseInt(suffix)
      }
      if (toSkip > queue.length || toSkip === queue.length) return message.reply('Songs to skip are higher or equels to songs in queue, if you want to stop the music use ' + message.client.config.prefix + 'stop.')
      toSkip = Math.min(toSkip, queue.length)

      queue.splice(0, toSkip - 1)

      const dispatcher = voiceConnection.player.dispatcher
      if (voiceConnection.paused) dispatcher.resume()
      message.channel.send('_**Skipping song(s)...**_')
      await dispatcher.end()
    } catch (err) {
      console.log(err)
    }
  }
}