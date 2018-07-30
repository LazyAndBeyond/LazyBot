module.exports = {
    "name": "say",
    "dm": false,
    "args": true,
    "usage": "<args>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Fun-Commands",
    "description": "Who said bots cant talk??",
  execute(message, args, level) {
    try {
    var test = true
    var say = message.content.split(' ').splice(1).join(' ')
    message.delete()
    message.channel.send(say)
    } catch(err) {
      console.log(err)
  }
 }
}