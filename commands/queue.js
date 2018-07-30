module.exports = {
    "name": "queue",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Music-Commands",
    "description": "Displays the music queue.",
  execute(message, args, level) {
      let queue = message.client.functions.getQueue(message.guild.id)
      let rb = '```'
      if (queue.length === 0) return message.channel.send('No music in queue')
      let text = ''
      for (let i = 0; i < queue.length; i++) {
        text += `${(i + 1)}. ${queue[i].title} | requested by ${queue[i].requested}\n`
      }
      message.channel.send(`${rb}xl\n${text}${rb}`)
  }
}