module.exports = {
    "name": "nowplaying",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": ["np"],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Music-Commands",
    "description": "Display the current song on the queue.",
  execute(message, args, level) {
      let queue = message.client.functions.getQueue(message.guild.id)
      const rb = '```'
      if (queue.length === 0) return message.channel.send(message, 'No music in queue')
      message.channel.send(`${rb}xl\nCurrently playing: ${queue[0].title} | by ${queue[0].requested}${rb}`)
  }
}