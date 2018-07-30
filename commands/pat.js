module.exports = {
    "name": "pat",
    "dm": false,
    "args": true,
    "usage": "<mention>",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Fun-Commands",
    "description": "Give someone the pat they deserve.",
  execute(message, args, level) {
    const neko = require('neko.js')
    const nekoclient = new neko.Client()
      let user = message.mentions.users.first()
      if (!user) return message.reply('Please mention someone to pat them.')
      if (user.id === message.author.id) return message.channel.send('O_o you wanna pat yourself??')
      nekoclient.pat().then((pat) => message.channel.send(`**${user}** , **${message.author.username}** patted you! \n`, {
        embed: {
          color: message.client.functions.getRandomInt(),
          image: {
            url: pat.url
          }
        }

      }).catch(e => console.warn('wew tf happened here ' + e)))
  }
}