module.exports = {
    "name": "hug",
    "dm": false,
    "args": true,
    "usage": "<mention>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "For people that really like to hug others and not get called weirdos or get beaten up.",
  execute(message, args, level) {
    const neko = require('neko.js')
    const nekoclient = new neko.Client()
      let user = message.mentions.users.first()
      if (!user) return message.reply('Please mention someone to pat them.')
      if (user.id === message.author.id) return message.channel.send('O_o you wanna hug yourself??')
      nekoclient.hug().then((hug) => message.channel.send(`**${user}** , **${message.author.username}** hugged you! \n`, {
        embed: {
          color: message.client.functions.getRandomInt(),
          image: {
            url: hug.url
          }
        }

      }).catch(e => console.warn('wew tf happened here ' + e)))
  }
}