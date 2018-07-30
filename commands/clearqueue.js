module.exports = {
    "name": "clearqueue",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": ["clear", "cq"],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Music-Commands",
    "description": "Clears out all the music queue.",
  execute(message, args, level) {
      let queue = message.client.functions.getQueue(message.guild.id)
      if (queue.length === 0) return message.channel.send(`No music in queue`)
      for (var i = queue.length - 1; i >= 0; i--) {
        queue.splice(i, 1)
      }
      message.channel.send(`Queue Cleared!`)
  }
}