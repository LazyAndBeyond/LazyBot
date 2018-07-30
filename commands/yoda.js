module.exports = {
    "name": "yoda",
    "dm": false,
    "args": true,
    "usage": "<args>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "Have you ever wanted to make ur crap messages into yoda speech?? now you can.",
  execute(message, args, level) {
    try {
    const snek = require('snekfetch')
    const speech = message.content.split(/\s+/g).slice(1).join(' ')
    snek.get(`http://yoda-api.appspot.com/api/v1/yodish?text=${encodeURIComponent(speech.toLowerCase())}`).then(res => {
    message.channel.send(res.body.yodish)
    })
    } catch(err) {
      throw err
    }
  }
}