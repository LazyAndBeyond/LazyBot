const Discord = require('discord.js')
const client = new Discord.Client()
const YoutubeDL = require('youtube-dl')
const ytdl = require('ytdl-core')
const config = require('./config.json')
const PREFIX = '$'
const GLOBAL = true
const MAX_QUEUE_SIZE = 20
const DEFAULT_VOLUME = 100
const ALLOW_ALL_SKIP = true
const CLEAR_INVOKER = false
const CHANNEL = false

const queues = {}

client.on('message', msg => {
  const message = msg.content.trim()

  if (msg.toLowerCase().startsWith(PREFIX.toLowerCase())) {
    const command = msg.substring(PREFIX.length).split(/[ \n]/)[0].toLowerCase().trim()
    const suffix = msg.substring(PREFIX.length + command.length).trim()

    switch (command) {
      case 'play':
        return play(msg, suffix)
      case 'skip':
        return skip(msg, suffix)
      case 'queue':
        return queue(msg, suffix)
      case 'pause':
        return pause(msg, suffix)
      case 'resume':
        return resume(msg, suffix)
      case 'volume':
        return volume(msg, suffix)
      case 'leave':
        return leave(msg, suffix)
      case 'clearqueue':
        return clearqueue(msg, suffix)
    }
    if (CLEAR_INVOKER) {
      msg.delete()
    }
  }
})

function isAdmin (member) {
  return member.hasPermission('ADMINISTRATOR')
}

function canSkip (member, queue) {
  if (ALLOW_ALL_SKIP) return true
  else if (queue[0].requester === member.id) return true
  else if (isAdmin(member)) return true
  else return false
}

function getQueue (server) {
  if (!queues[server]) queues[server] = []
  return queues[server]
}

function play (msg, suffix) {
  if (!CHANNEL && msg.member.voiceChannel === undefined) return msg.channel.send(wrap('You\'re not in a voice channel.'))

  if (!suffix) return msg.channel.send(wrap('No video specified!'))

  const queue = getQueue(msg.guild.id)

  if (queue.length >= MAX_QUEUE_SIZE) {
    return msg.channel.send(wrap('Maximum queue size reached!'))
  }

  msg.channel.send(wrap('Searching...')).then(response => {
    var searchstring = suffix
    if (!suffix.toLowerCase().startsWith('http')) {
      searchstring = 'gvsearch1:' + suffix
    }

    YoutubeDL.getInfo(searchstring, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
      if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
        return response.edit(wrap('Invalid video!'))
      }

      info.requester = msg.author.id

      response.edit(wrap('Queued: ' + info.title)).then(() => {
        queue.push(info)
        if (queue.length === 1) executeQueue(msg, queue)
      }).catch(console.log)
    })
  }).catch(console.log)
}

function skip (msg, suffix) {
  const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id)
  if (voiceConnection === null) return msg.channel.send(wrap('No music being played.'))

  const queue = getQueue(msg.guild.id)

  if (!canSkip(msg.member, queue)) {
    return msg.channel.send(wrap('You cannot skip this as you didn\'t queue it.')).then((response) => {
      response.delete(5000)
    })
  }

  let toSkip = 1
  if (!isNaN(suffix) && parseInt(suffix) > 0) {
    toSkip = parseInt(suffix)
  }
  toSkip = Math.min(toSkip, queue.length)

  queue.splice(0, toSkip - 1)

  const dispatcher = voiceConnection.player.dispatcher
  if (voiceConnection.paused) dispatcher.resume()
  dispatcher.end()

  msg.channel.send(wrap('Skipped ' + toSkip + '!'))
}

function queue (msg, suffix) {
  const queue = getQueue(msg.guild.id)

  const text = queue.map((video, index) => (
			(index + 1) + ': ' + video.title
		)).join('\n')

  let queueStatus = 'Stopped'
  const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id)
  if (voiceConnection !== null) {
    const dispatcher = voiceConnection.player.dispatcher
    queueStatus = dispatcher.paused ? 'Paused' : 'Playing'
  }

  msg.channel.send(wrap('Queue (' + queueStatus + '):\n' + text))
}

function pause (msg, suffix) {
  const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id)
  if (voiceConnection === null) return msg.channel.send(wrap('No music being played.'))

  if (!isAdmin(msg.member)) { return msg.channel.send(wrap('You are not authorized to use this.')) }

  msg.channel.send(wrap('Playback paused.'))
  const dispatcher = voiceConnection.player.dispatcher
  if (!dispatcher.paused) dispatcher.pause()
}

function leave (msg, suffix) {
  if (isAdmin(msg.member)) {
    const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id)
    if (voiceConnection === null) return msg.channel.send(wrap('I\'m not in any channel!.'))
    const queue = getQueue(msg.guild.id)
    queue.splice(0, queue.length)
    voiceConnection.player.dispatcher.end()
    voiceConnection.disconnect()
  } else {
    msg.channel.send(wrap('You don\'t have permission to use that command!'))
  }
}

function clearqueue (msg, suffix) {
  if (isAdmin(msg.member)) {
    const queue = getQueue(msg.guild.id)

    queue.splice(0, queue.length)
    msg.channel.send(wrap('Queue cleared!'))
  } else {
    msg.channel.send(wrap('You don\'t have permission to use that command!'))
  }
}

function resume (msg, suffix) {
  const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id)
  if (voiceConnection === null) return msg.channel.send(wrap('No music being played.'))

  if (!isAdmin(msg.member)) { return msg.channel.send(wrap('You are not authorized to use this.')) }
  msg.channel.send(wrap('Playback resumed.'))
  const dispatcher = voiceConnection.player.dispatcher
  if (dispatcher.paused) dispatcher.resume()
}

function volume (msg, suffix) {
  const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id)
  if (voiceConnection === null) return msg.channel.send(wrap('No music being played.'))

  if (!isAdmin(msg.member)) { return msg.channel.send(wrap('You are not authorized to use this.')) }

  const dispatcher = voiceConnection.player.dispatcher

  if (suffix > 200 || suffix < 0) {
    return msg.channel.send(wrap('Volume out of range!')).then((response) => {
      response.delete(5000)
    })
  }

  msg.channel.send(wrap('Volume set to ' + suffix))
  dispatcher.setVolume((suffix / 100))
}

function executeQueue (msg, queue) {
  if (queue.length === 0) {
    msg.channel.send(wrap('Playback finished.'))
    const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id)
    if (voiceConnection !== null) return voiceConnection.disconnect()
  }

  new Promise((resolve, reject) => {
    const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id)
    if (voiceConnection === null) {
      if (CHANNEL) {
        msg.guild.channels.find('name', CHANNEL).join().then(connection => {
          resolve(connection)
        }).catch((error) => {
          console.log(error)
        })
      } else if (msg.member.voiceChannel) {
        msg.member.voiceChannel.join().then(connection => {
          resolve(connection)
        }).catch((error) => {
          console.log(error)
        })
      } else {
        queue.splice(0, queue.length)
        reject()
      }
    } else {
      resolve(voiceConnection)
    }
  }).then(connection => {
    const video = queue[0]

    console.log(video.webpage_url)

    msg.channel.send(wrap('Now Playing: ' + video.title)).then(() => {
      let dispatcher = connection.playStream(ytdl(video.webpage_url, {filter: 'audioonly'}), {seek: 0, volume: (DEFAULT_VOLUME / 100)})

      connection.on('error', (error) => {
        console.log(error)
        queue.shift()
        executeQueue(msg, queue)
      })

      dispatcher.on('error', (error) => {
        console.log(error)
        queue.shift()
        executeQueue(msg, queue)
      })

      dispatcher.on('end', () => {
        setTimeout(() => {
          if (queue.length > 0) {
            queue.shift()
            executeQueue(msg, queue)
          }
        }, 1000)
      })
    }).catch((error) => {
      console.log(error)
    })
  }).catch((error) => {
    console.log(error)
  })
}

function wrap (text) {
  return '```js\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}

client.on('ready', () => {
  console.log('logged in')
})

client.login(config.token)
