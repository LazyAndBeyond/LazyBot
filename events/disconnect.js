module.exports = (Bot) => { //You spelt Module.exports wrong lmao
  const Discord = require('discord.js')
  const Client = new Discord.Client()
  console.log("Bot disconnected, attemting to restart...")
  Client.login(Client.config.token)
}
