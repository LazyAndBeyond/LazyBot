module.exports = {
    "name": "8ball",
    "dm": false,
    "args": true,
    "usage": "<question>",
    "aliases": ["8"],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Fun-Commands",
    "description": "Ask and the great 8ball will answer!",
    execute(message, args, level) {
  const Discord = require('discord.js')
  const answer = [
    'It is certain',
    'It is decidedly so',
    'Without a doubt',
    'Yes, definitely',
    'You may rely on it',
    'As I see it, yes',
    'Most likely',
    'Yes',
    'Signs point to yes',
    'The reply is hazy, try again',
    'Ask again later',
    'I\'d better not tell you now',
    'I cannot predict now',
    'Concentrate and ask again',
    'Don\'t count on it',
    'My sources say no',
    'The outlook isn\'t so good',
    'Very doubtful',
    'B-Baka! No!',
    'Yes daddy...',
    'Is that iven a question?!',
    'Try to ask someone else... IM BUSY!!',
    'Dont ask me ask you mom!!',
    'NOPE!!!',
    'YEA!!!',
    'No comment...',
    'Try agin...'
  ]
  let question = message.content.split(/\s+/g).slice(1).join(' ')
  
  if (question === 'yes' || question === 'fuck' || question === 'no') return message.reply('Really....')

  if (!question) {
    return message.channel.send('You must provide a question!')
  }

  const embed = new Discord.RichEmbed()
              .setAuthor(question, 'https://a.safe.moe/aKDHV.png')
              .setDescription(answer[Math.round(Math.random() * (answer.length - 1))] + '.')
              .setColor('RANDOM')
  return message.channel.send({ embed })
    }
}