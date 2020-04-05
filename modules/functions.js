const queues = {}
const search = require('youtube-search')
const ytdl = require('ytdl-core')
const tokens = require('../data/tokens.json')
const opts = {
  part: 'snippet',
  maxResults: 10,
  key: tokens.YTAPI,
  type: 'video'
}
module.exports = {
  
  isAdmin(member) {
    return member.permissions.has('ADMINISTRATOR')
  },
  
  getRandomInt() {
  return Math.floor(Math.random() * 16777215).toString(10)
  },
  
  permLevel(message) { 
    let permlvl = 0

    const permOrder = message.client.settings.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1)

    while (permOrder.length) {
      const currentLevel = permOrder.shift()
      if (message.guild && currentLevel.guildOnly) continue
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level
        break
      }
    }
    return permlvl
  },
  
  volume(msg, suffix) {
  const bot = msg.client
  const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id === msg.guild.id)
  if (voiceConnection === null) return msg.reply('**No music being played.**')

  const dispatcher = voiceConnection.player.dispatcher

  if (suffix > 100 || suffix < 0) {
    return msg.reply('**Volume out of range!**').then((response) => {
      response.delete(5000)
    })
  }

  msg.channel.send('Volume set to **' + suffix + '**')
  dispatcher.setVolume((suffix / 100))
},
  
  getQueue(guild) {
  if (!guild) return
  if (typeof guild === 'object') guild = guild.id
  if (queues[guild]) return queues[guild]
  else queues[guild] = []
  return queues[guild]
  },
  
  play(message, queue, song) {
    let player
    let test = true
    const bot = message.client
    try {
      if (!message || !queue) return

      if (song) {
        search(song, opts, function (err, results) {
          if (err) return message.channel.send('Video not found please try to use a youtube link instead.')
          song = (song.includes('https://') || song.includes('http://')) ? song : results[0].link

          let stream = ytdl(song, {
            audioonly: true,
            qualty: "highestaudio",
            highWaterMark: 30000,
            type: 'video'
          })
         if (queue.length > 0) test = false
          queue.push({
            'title': results[0].title,
            'requested': message.author.username,
            'toplay': stream
          })
          message.channel.send('Queued **' + queue[queue.length - 1].title + '**')
          if (test) {
            setTimeout(function () {
              bot.functions.play(message, queue)
            }, 1000)
          }
        })
      } else if (queue.length !== 0) {
        message.channel.send(`Now Playing **${queue[0].title}** | Requested by ***${queue[0].requested}***`)

        const connection = message.guild.voiceConnection
        if (!connection) return console.log('No connection!')

        player = connection.playStream(queue[0].toplay)
        

        player.on('error', () => {
                  queue.shift()
          message.channel.send('Sorry lads an error occurred while playing this song')
          bot.functions.play(message, queue)
        })
        player.on('end', () => {
                  queue.shift()
          bot.functions.play(message, queue)
        })
      }
    } catch (err) {
      console.log(err)
    }
  },
  
  volume(msg, suffix) {
    const voiceConnection = msg.client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id)
    if (voiceConnection === null) return msg.reply('**No music being played.**')

    const dispatcher = voiceConnection.player.dispatcher

    if (suffix > 200 || suffix < 0 || suffix === 0) {
      return msg.reply('**Volume out of range!**').then((response) => {
        response.delete(5000)
      })
    }

    msg.channel.send('Volume set to **' + suffix + '**')
    dispatcher.setVolume((suffix / 100))
  }
  
}




