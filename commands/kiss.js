module.exports = {
    "name": "kiss",
    "dm": false,
    "args": true,
    "usage": "<mention>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Fun-Commands",
    "description": "You can kiss someone through discord now!",
  execute(message, args, level) {
    const neko = require('neko.js')
    const nekoclient = new neko.Client()
      let user = message.mentions.users.first()
      if (!user) return message.reply('Please mention someone to pat them.')
      if (user.id === message.author.id) return message.channel.send('O_o you wanna kiss yourself??')
      nekoclient.kiss().then((kiss) => message.channel.send(`**${user}** , **${message.author.username}** kissed you! \n`, {
        embed: {
          color: message.client.functions.getRandomInt(),
          image: {
            url: kiss.url
          }
        }

      }).catch(e => console.warn('wew tf happened here ' + e)))
  }
}