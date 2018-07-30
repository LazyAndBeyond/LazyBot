module.exports = {
    "name": "volume",
    "dm": false,
    "args": true,
    "usage": "<1/200>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Music-Commands",
    "description": "Change the volume of the music.",
  execute(message, args, level) {
      let suffix = message.content.split(' ').slice(1).join(' ')
      if (!suffix) return message.reply('You need to set a volume')
      message.client.functions.volume(message, suffix) 
  }
}