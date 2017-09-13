
const Discord = require('discord.js')
const started = Date()
const time = new Date()
const errorlog = require('./data/errors.json')
const array = []
const array1 = require('./data/disableS')
const object = require('./data/default.json')

try {
  var config = require('./config.json')
  console.log('Config file detected!')
} catch (err) {
  console.log(err)
  console.log('No config detected, attempting to use environment variables...')
  if (process.env.MUSIC_BOT_TOKEN && process.env.YOUTUBE_API_KEY) {
    console.log('No token passed! Exiting...')
    process.exit(0)
  }
}
const admins = config.admins
const swearWords = ['fuck', 'shit', 'dick', 'pussy', 'fuck off', 'fuck you', 'fucking', 'cunt']
const bot = new Discord.Client({autoReconnect: true})
const notes = require('./data/notes.json')
const os = require('os')
const prefix = config.prefix
const rb = '```'
const sbl = require('./data/blservers.json')
const ubl = require('./data/blusers.json')
const fs = require('fs')
const warns = require('./data/warns.json')
const queues = {}
const ytdl = require('ytdl-core')
const search = require('youtube-search')
const ms = require('ms')
const opts = {
  part: 'snippet',
  maxResults: 10,
  key: config.youtube_api_key
}
var intent

function getQueue (guild) {
  if (!guild) return
  if (typeof guild === 'object') guild = guild.id
  if (queues[guild]) return queues[guild]
  else queues[guild] = []
  return queues[guild]
}

var paused = {}

function play (msg, queue, song) {
  try {
    if (!msg || !queue) return
        // if (msg.guild.voiceConnection.channel.members.first() == undefined)
    if (song) {
      search(song, opts, function (err, results) {
        if (err) return msg.channel.send('Video not found please try to use a youtube link instead.')
        song = (song.includes('https://' || 'http://')) ? song : results[0].link
        let stream = ytdl(song, {
          audioonly: true
        })
        let test
        if (queue.length === 0) test = true
        queue.push({
          'title': results[0].title,
          'requested': msg.author.username,
          'toplay': stream
        })
        console.log('Queued ' + queue[queue.length - 1].title + ' in ' + msg.guild.name + ' as requested by ' + queue[queue.length - 1].requested)
        msg.channel.send('Queued **' + queue[queue.length - 1].title + '**')
        if (test) {
          setTimeout(function () {
            play(msg, queue)
          }, 1000)
        }
      })
    } else if (queue.length !== 0) {
      msg.channel.send(`Now Playing **${queue[0].title}** | Requested by ***${queue[0].requested}***`)
      console.log(`Playing ${queue[0].title} as requested by ${queue[0].requested} in ${msg.guild.name}`)
      let connection = msg.guild.voiceConnection
      if (!connection) return console.log('No Connection!')
      intent = connection.playStream(queue[0].toplay)

      intent.on('error', () => {
        queue.shift()
        play(msg, queue)
      })

      intent.on('end', () => {
        queue.shift()
        play(msg, queue)
      })
    } else {
      msg.channel.send('No more music in queue! Starting autoplaylist')

            // TODO: When no more music, play randomly from playlist

      getRandomMusic(queue, msg)
    }
  } catch (err) {
    console.log('WELL LADS LOOKS LIKE SOMETHING WENT WRONG!' + err.stack)
    errorlog[String(Object.keys(errorlog).length)] = {
      'code': err.code,
      'error': err,
      'stack': err.stack
    }
    fs.writeFile('./data/errors.json', JSON.stringify(errorlog), function (err) {
      if (err) return console.log("Even worse we couldn't write to our error log file! Make sure data/errors.json still exists!")
    })
  }
}

function secondsToString (seconds) {
  try {
    var numyears = Math.floor(seconds / 31536000)
    var numdays = Math.floor((seconds % 31536000) / 86400)
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600)
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60)
    var numseconds = Math.round((((seconds % 31536000) % 86400) % 3600) % 60)

    var str = ''
    if (numyears > 0) {
      str += numyears + ' year' + (numyears === 1 ? '' : 's') + ' '
    }
    if (numdays > 0) {
      str += numdays + ' day' + (numdays === 1 ? '' : 's') + ' '
    }
    if (numhours > 0) {
      str += numhours + ' hour' + (numhours === 1 ? '' : 's') + ' '
    }
    if (numminutes > 0) {
      str += numminutes + ' minute' + (numminutes === 1 ? '' : 's') + ' '
    }
    if (numseconds > 0) {
      str += numseconds + ' second' + (numseconds === 1 ? '' : 's') + ' '
    }
    return str
  } catch (err) {
    console.log('Could not get time')
    return 'Could not get time'
  }
}

function isCommander (id) {
  if (id === config.owner_id) {
    return true
  }
  for (var i = 0; i < admins.length; i++) {
    if (admins[i] === id) {
      return true
    }
  }
  return false
}

bot.on('ready', function () {
  try {
    config.client_id = bot.user.id
    bot.user.setStatus('online', config.status)
    bot.user.setGame(prefix + 'help , in ' + bot.guilds.size + ' servers! with ' + bot.users.size + ' users!')
    bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb} [ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Logging in to Discord${rb}`)
    var msg = `
------------------------------------------------------
> Logging in...
------------------------------------------------------
Logged in as ${bot.user.username} [ID ${bot.user.id}]
On ${bot.guilds.size} servers!
${bot.channels.size} channels and ${bot.users.size} users cached!
Bot is logged in and ready to play some tunes!
LET'S GO!
------------------------------------------------------`

    console.log(msg)
    var errsize = Number(fs.statSync('./data/errors.json')['size'])
    console.log('Current error log size is ' + errsize + ' Bytes')
    if (errsize > 5000) {
      errorlog = {}
      fs.writeFile('./data/errors.json', JSON.stringify(errorlog), function (err) {
        if (err) return console.log("Uh oh we couldn't wipe the error log")
        console.log('Just to say, we have wiped the error log on your system as its size was too large')
      })
    }
    console.log('------------------------------------------------------')
  } catch (err) {
    console.log('WELL LADS LOOKS LIKE SOMETHING WENT WRONG!' + err.stack)
    errorlog[String(Object.keys(errorlog).length)] = {
      'code': err.code,
      'error': err,
      'stack': err.stack
    }
    fs.writeFile('./data/errors.json', JSON.stringify(errorlog), function (err) {
      if (err) return console.log("Even worse we couldn't write to our error log file! Make sure data/errors.json still exists!")
    })
  }
})

bot.on('voiceStateUpdate', function (oldMember, newMember) {
  var svr = bot.guilds.array()
  for (var i = 0; i < svr.length; i++) {
    if (svr[i].voiceConnection) {
      if (paused[svr[i].voiceConnection.channel.id]) {
        if (svr[i].voiceConnection.channel.members.size > 1) {
          svr[i].defaultChannel.send('I resumed my music in ' + svr[i].voiceConnection.channel.name)
          paused[svr[i].voiceConnection.channel.id].player.resume()
          var game = bot.user.presence.game.name
          delete paused[svr[i].voiceConnection.channel.id]
          game = game.split('⏸')[1]
          bot.user.setGame(game)
        }
      }
      if (svr[i].voiceConnection.channel.members.size === 1 && !svr[i].voiceConnection.player.dispatcher.paused) {
        svr[i].defaultChannel.send('I paused my music in the voice channel because no one is there,rejoin so i satrt it again.')
        svr[i].voiceConnection.player.dispatcher.pause()
        paused[svr[i].voiceConnection.channel.id] = {
          'player': svr[i].voiceConnection.player.dispatcher
        }
        bot.user.setGame('' + game)
      }
    }
  }
})
bot.on('guildCreate', guild => {
  const rb = '```'
  bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb} [ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Joined: "${guild.name}" (id: "${guild.id}"). \nWith: "${guild.memberCount}" members!${rb}`)
  bot.user.setGame(prefix + 'help , in ' + bot.guilds.size + ' servers!')
  bot.on('guildDelete', guild => {
    bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb} [ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Leaft: "${guild.name}" (id: "${guild.id}")${rb}`)
    bot.user.setGame(prefix + 'help , in ' + bot.guilds.size + ' servers!')
  })
})
bot.on('message', function (message) {
  try {
    if (message.author.bot) return
    if (message.channel.type === 'dm') {
      message.channel.send('please use commands in servers')
      return
    }
    if (sbl.indexOf(message.guild.id) !== -1 && message.content.startsWith(prefix)) {
      message.channel.send('This server is blacklisted f*cker!')
      return
    }
    if (ubl.indexOf(message.author.id) !== -1 && message.content.startsWith(prefix)) {
      message.reply(' you are blacklisted and can not use the bot!')
      return
    }
    const GuildID = message.guild.id
    if (swearWords.some(word => message.content.includes(word))) {
      if (array1.includes(GuildID)) {
        message.reply('Oh no you said a bad word!!!')
        message.delete()
      }
    }
    if (message.content.startsWith(prefix + 'ping')) {
      var before = Date.now()
      message.channel.send('Pong!').then(function (msg) {
        var after = Date.now()
        msg.edit('Pong! **' + (after - before) + '**ms')
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}ping .${rb}`)
      })
    }

    if (message.content.startsWith(prefix + 'help')) {
      message.author.send(`${rb}
${prefix}help - Shows this message.
${prefix}announce - announce a message to all servers (Owner Only).
${prefix}ping - Ping/Pong with ms amount.
${prefix}servers Shows amount of servers.
${prefix}play - Plays the song you requested.
${prefix}voteskip - You may vote to skip a song.
${prefix}volume <volume> - Change the volume.
${prefix}queue - Check the list of songs that are queued.
${prefix}np/nowplaying - Check the current song out.
${prefix}skip - Skips the playing song.
${prefix}pause - Pause the current song.
${prefix}kick <reason> - kick a member from the server.
${prefix}ban <reason> - ban a member from the server.
${prefix}enable - enable resiving announcements (resiving announcements is seted to enable by default).
${prefix}disable - disable resiving announcements.
${prefix}swearEnable - enables swear auto detect system.
${prefix}swearDisable - disables swear auto detect system.
${prefix}mylevel - Shows you your current lvl and points (you can lvl up by using commands).
${prefix}resetwarn <user> - Deletes a warning from a user.
${prefix}checkwarn <user> - Lookup warning information on a user.
${prefix}listemojis - give you all comstume emojis in the server (only costume emojis).
${prefix}review - send a review to the bot dev server.
${prefix}eval - (Owner only).
${prefix}clearqueue - Clears the list of queues.
${prefix}say - Admin only.
${prefix}resume - Resumes paused song.
${prefix}about - Info about the bot.
${prefix}shutdown - Power off the bot (Owner only).
${prefix}invite - Creates OAuth URL for bot.
${prefix}userblacklist <add/remove> <user id> - Blacklists a user.
${prefix}warn <user> <reason> - Warns a user for the thing they did wrong.
${prefix}remindme <time> <text> - Reminds you of something in a certain time.
${prefix}serverblacklist <add/remove> <server id> - Adds or removes servers from blacklist.
${prefix}note - Takes a note.
${prefix}mynotes - Shows notes you have taken.
${prefix}kill - the bot leaves your server (server owner only).
${prefix}setName - change the bot name (Owner only).
${prefix}uptime - Shows bot uptime.
${prefix}support - gives you the bot support server.
${prefix}avatar <mention> - gives you someones avatar.
${prefix}Info - send an embed with some bot info.
${prefix}sys - Gets system information.${rb}`)
      message.channel.send("Check your DM's **" + message.author.username + '**')
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}help .${rb}`)
    }
    if (message.content.startsWith(prefix + 'support')) {
      message.channel.send("**Hello**,ther's my development support server https://discord.gg/RnvdQXg ")
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}support .${rb}`)
    }
    if (message.content.startsWith(prefix + 'shutdown')) {
      if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) !== -1) {
        message.channel.send('Shutdown has been initiated.\n**Shutting down...**')
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Exitting Discord......${rb}`)
        setTimeout(function () {
          bot.destroy()
        }, 1000)
        setTimeout(function () {
          process.exit()
        }, 2000)
      }
    }
    if (message.content.startsWith(prefix + 'setName')) {
      if (message.author.id === config.owner_id) {
        var name = message.content.split(' ').splice(1).join(' ')
        if (!name) message.channel.send('you need to specify a name.')
        console.log('Bot name got setted to ' + name)
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}setName .${rb}`)
        bot.user.setUsername(name)
        message.channel.send('✔ Username setted!')
      } else {
        message.channel.send('you dont have permisson to run this command.')
      }
    }
    if (message.content.startsWith(prefix + 'avatar')) {
      let user = message.mentions.users.first()
      if (!user) message.channel.send('you need to mention a user')
      let avatar = message.mentions.users.first().displayAvatarURL()
      if (!avatar) message.channel.send('this user has no avatar.')
      message.channel.send(avatar)
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}avatar .${rb}`)
    }
    if (message.content.startsWith(prefix + 'servers')) {
      message.channel.send("I'm currently on **" + bot.guilds.size + 'server(s)**')
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}servers .${rb}`)
    }
    if (message.content.startsWith(prefix + 'DM')) {
      const args = message.content.split(' ').splice(1)
      if (!args) message.channel.send('you specify what should i send.')
      let memeber = message.mentions.members.first()
      if (!memeber) message.channel.send('you need add a mention to the command dummy.')
      let args1 = args.slice(1).join(' ')
      bot.users.find('id', message.mentions.members.first().id).send(`**${message.author.username}** sended you a DM: \n${args1}`)
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}DM .${rb}`)
      message.channel.send('DM Successfuly sent!')
    }
    if (message.content.startsWith(prefix + 'Info')) {
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}Info .${rb}`)
      message.channel.send({embed: {
        color: 3447489,
        author: {
          name: bot.user.username,
          icon_url: bot.user.avatarURL
        },
        title: 'Info',
        description: 'This is an embed of Mayumi-San infos.',
        fields: [{
          name: 'Support commands',
          value: 'For support do $help or $support'
        },
        {
          name: 'Invite Mayumi-San to your server.',
          value: 'To invite Mayumi-San to your server click >>>>> [here](http://discordapp.com/oauth2/authorize?client_id=336910384541990912&scope=bot&permissions=8)'
        },
        {
          name: 'Bot Owner',
          value: 'The owner of Mayumi-San is AyoubMadrid feel free to join the development server by using $support.'
        }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: ''
        }
      }
      })
    }
    if (message.content.startsWith(prefix + 'listemojis')) {
      const emojiList = message.guild.emojis.map(e => e.toString()).join(' ')
      message.channel.send(`Here are** ${message.guild.name} **Emojis: \n${emojiList}`)
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}listemojis .${rb}`)
    }
    if (message.content === prefix + 'uptime') {
      message.channel.send('I have been up for `' + secondsToString(process.uptime()) + '` - My process was started at this time --> `' + started + '`')
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}uptime .${rb}`)
    }
    if (message.content.startsWith(prefix + 'play')) {
      if (!message.guild.voiceConnection) {
        if (!message.member.voiceChannel) return message.channel.send('You need to be in a voice channel')
        var chan = message.member.voiceChannel
        chan.join()
      }
      let suffix = message.content.split(' ').slice(1).join(' ')
      if (!suffix) return message.channel.send('You need to specify a song link or a song name!')

      play(message, getQueue(message.guild.id), suffix)
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}play .${rb}`)
    }

    if (message.content.startsWith(prefix + 'sys')) {
      message.channel.send('```' + `js\nSystem info: ${process.platform}-${process.arch} with ${process.release.name} version ${process.version.slice(1)}\nProcess info: PID ${process.pid} at ${process.cwd()}\nProcess memory usage: ${Math.ceil(process.memoryUsage().heapTotal / 1000000)} MB\nSystem memory usage: ${Math.ceil((os.totalmem() - os.freemem()) / 1000000)} of ${Math.ceil(os.totalmem() / 1000000)} Bot info: ID ${bot.user.id}#${bot.user.discriminator} \nName: ${bot.user.username}  \nPrefixs: ${'$'} \nCharacterLimit: ${2000}  \nServers: ${bot.guilds.size} \nChannels: ${bot.channels.size} \nUsers: ${bot.users.size} \nAdmins: ${config.admins} ` + '```')
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}sys .${rb}`)
    }
    if (message.content.startsWith(prefix + 'serverblacklist')) {
      if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) !== -1) {
        let c = message.content.split(' ').splice(1).join(' ')
        let args = c.split(' ')
        console.log('[DEVELOPER DEBUG] Blacklist args were: ' + args)
        if (args[0] === 'remove') {
          sbl.splice(sbl.indexOf(args[1]))
          fs.writeFile('./data/blservers.json', JSON.stringify(sbl), function (err) { if (err) { return console.log(err) } })
          message.channel.send('Server have been removed from blacklist.')
          bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}serverblacklist remove .${rb}`)
        } else if (args[0] === 'add') {
          sbl.push(args[1])
          fs.writeFile('./data/blservers.json', JSON.stringify(sbl), function (err) { if (err) { return console.log(err) } })
          message.channel.send('Server have been added to blacklist.')
          bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}serverblacklist add .${rb}`)
        } else {
          message.channel.send(`You need to specify what to do! ${prefix}serverblacklist <add/remove> <server id>`)
        }
      } else {
        message.channel.send('Sorry, this command is for the owner only.')
      }
    }
    if (message.content.startsWith(prefix + 'note')) {
      if (notes[message.author.id] === undefined) {
        notes[message.author.id] = {
          'notes': []
        }
      }
      notes[message.author.id].notes[notes[message.author.id].notes.length] = {
        'content': message.cleanContent.split(' ').splice(1).join(' '),
        'time': Date()
      }
      fs.writeFile('./data/notes.json', JSON.stringify(notes), function (err) {
        if (err) return
        message.channel.send('Added to notes! Type `' + prefix + 'mynotes` to see all your notes')
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}note .${rb}`)
      })
    }
    if (message.content.startsWith(prefix + 'kick')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || message.member.permissions.has('ADMINISTRATOR')) {
        var args = message.content.split(' ').splice(1)
        if (!args) message.channel.send('you need to add a reason.')
        let member = message.mentions.members.first()
        let args1 = args.slice(1).join(' ')
        bot.users.find('id', message.mentions.members.first().id).send('you have been kicked from ' + message.guild.name + ' for **' + `${args1}` + '**')
        member.kick()
        message.channel.send('User have been kicked.')
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}kick .${rb}`)
      } else {
        message.channel.send('you dont have permisson to run this command')
      }
    }
    if (message.content.startsWith(prefix + 'ban')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || message.member.permissions.has('ADMINISTRATOR')) {
        const args = message.content.split(' ').splice(1).join(' ')
        if (!args) return message.channel.send('you need to add a reason.')
        let member = message.mentions.members.first()
        let args1 = args.slice(1).join(' ')
        bot.users.find('id', message.mentions.members.first().id).send('you have been banned from ' + message.guild.name + ' for **' + `${args1}` + '**')
        member.ban()
        message.channel.send('user have been banned.')
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}ban .${rb}`)
      } else {
        message.channel.send('you dont have permisson to run this command')
      }
    }
    if (message.content === prefix + 'mynotes') {
      var nutes = 'Here are your notes:\n\n```'
      for (var i = 0; i < notes[message.author.id].notes.length; i++) {
        nutes += `${i + 1}) '${notes[message.author.id].notes[i].content}' - Added ${notes[message.author.id].notes[i].time}\n`
      }

      nutes += '```'
      message.channel.send(nutes)
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}mynotes .${rb}`)
    }

    if (message.content.startsWith(prefix + 'userblacklist')) {
      if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) !== -1) {
        let c = message.content.split(' ').splice(1).join(' ')
        let args = c.split(' ')
        console.log('[DEVELOPER DEBUG] Blacklist args were: ' + args)
        if (args[0] === 'remove') {
          ubl.splice(ubl.indexOf(args[1]))
          fs.writeFile('./data/blusers.json', JSON.stringify(ubl), function (err) { if (err) { return console.log(err) } })
          message.channel.send('User have been removed from blacklist.')
          bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}userblacklist remove .${rb}`)
        } else if (args[0] === 'add') {
          ubl.push(args[1])
          fs.writeFile('./data/blusers.json', JSON.stringify(ubl), function (err) { if (err) { return console.log(err) } })
          message.channel.send('User have been added to blacklist.')
          bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}userblacklist add .${rb}`)
        } else {
          message.channel.send(`You need to specify what to do! ${prefix}userlacklist <add/remove> <user id>`)
        }
      } else {
        message.channel.send('Sorry, this command is for the owner only.')
      }
    }

    if (message.content.startsWith(prefix + 'clear')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || config.admins.indexOf(message.author.id) !== -1 || message.member.permissions.has('ADMINISTRATOR')) {
        let queue = getQueue(message.guild.id)
        if (queue.length === 0) return message.channel.send(`No music in queue`)
        for (var i = queue.length - 1; i >= 0; i--) {
          queue.splice(i, 1)
        }
        message.channel.send(`Cleared the queue`)
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}clear .${rb}`)
      } else {
        message.channel.send('Only the admins can do this command')
      }
    }

    if (message.content.startsWith(prefix + 'checkwarn')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || config.admins.indexOf(message.author.id) !== -1 || message.member.permissions.has('ADMINISTRATOR')) {
        let user = message.mentions.users.array()[0]
        if (!user) return message.channel.send('You need to mention the user')
        let list = Object.keys(warns)
        let found = ''
        let foundCounter = 0
        let warnCase
                // looking for the case id
        for (let i = 0; i < list.length; i++) {
          if (warns[list[i]].user.id === user.id) {
            foundCounter++
            found += `${(foundCounter)}. Username: ${warns[list[i]].user.name}\nAdmin: ${warns[list[i]].admin.name}\nServer: ${warns[list[i]].server.name}\nReason: ${warns[list[i]].reason}\n`
          }
        }
        if (foundCounter === 0) return message.channel.send('No warns recorded for that user')
        message.channel.send(`Found ${foundCounter} warns\n ${found}`)
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}checkwarn .${rb}`)
      } else {
        message.channel.send('Only the admins can do this command')
      }
    }
    let points = JSON.parse(fs.readFileSync('./data/points.json'))

    if (!message.content.startsWith(prefix)) return
    if (message.author.bot) return

    if (!points[message.author.id]) {
      points[message.author.id] = {
        points: 0,
        level: 0
      }
    }
    let userData = points[message.author.id]
    userData.points++

    let curLevel = Math.floor(0.1 * Math.sqrt(userData.points))
    if (curLevel > userData.level) {
        // Level up!
      userData.level = curLevel
      message.reply(`You"ve leveled up to level **${curLevel}**! Ain"t that dandy?`)
    }

    if (message.content.startsWith(prefix + 'mylevel')) {
      message.reply(`You are currently level **${userData.level}**, with **${userData.points}** points.`)
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}mylevel .${rb}`)
    }
    fs.writeFile('./data/points.json', JSON.stringify(points), (err) => {
      if (err) console.error(err)
    })
    if (message.content.startsWith(prefix + 'setdefault')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || config.admins.indexOf(message.author.id) !== -1 || message.member.permissions.has('ADMINISTRATOR')) {
        object[message.guild.id] = message.channel.id
        message.channel.send('Default channel setted to ' + message.channel.name)
        object[message.guild.id] = message.channel.id
        fs.writeFile('./data/default.json', JSON.stringify(object), function (err) { if (err) { return console.log(err) } })
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}setdefault .${rb}`)
      }
    }
    if (message.content.startsWith(prefix + 'skip')) {
      let player = message.guild.voiceConnection.player.dispatcher
      if (!player || player.paused) return message.channel.send('Bot is not playing!')
      message.channel.send('Skipping song...')
      player.end()
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}skip .${rb}`)
    }

    if (message.content.startsWith(prefix + 'resetwarn')) {
      if (message.author.id === config.owner_id || message.member.permissions.has('ADMINISTRATOR')) {
        let user = message.mentions.users.array()[0]
        if (!user) return message.channel.send('You need to mention the user')
        let list = Object.keys(warns)
        let found
                // looking for the case id
        for (let i = 0; i < list.length; i++) {
          if (warns[list[i]].user.id === user.id) {
            found = list[i]
            break
          }
        }
        if (!found) return message.channel.send('Nothing found for this user')
        message.channel.send(`Delete the case of ${warns[found].user.name}\nReason: ${warns[found].reason}`)
        delete warns[found]
        fs.writeFile('./data/warns.json', JSON.stringify(warns))
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}resetwarn .${rb}`)
      } else {
        message.channel.send('You have to be able to kick/ban members to use this command')
      }
    }

    if (message.content.startsWith(prefix + 'pause')) {
      let player = message.guild.voiceConnection.player.dispatcher
      if (!player || player.paused) return message.channel.send('Bot is not playing')
      player.pause()
      message.channel.send('Pausing music...')
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}pause .${rb}`)
    }

    if (message.content.startsWith(prefix + 'stop')) {
      let player = message.guild.voiceConnection.player.dispatcher
      var chan = message.member.voiceChannel
      message.channel.send('Stopping music...')
      player.end()
      chan.leave()
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}stop .${rb}`)
    }

    if (message.content.startsWith(prefix + 'warn')) {
      if (message.author.id === config.owner_id || message.member.permissions.has('ADMINISTRATOR')) {
        let c = message.content
        let usr = message.mentions.users.array()[0]
        if (!usr) return message.channel.send('You need to mention the user')
        let rsn = c.split(' ').splice(1).join(' ').replace(usr, '').replace('<@!' + usr.id + '>', '')
        let caseid = genToken(20)

        function genToken (length) {
          let key = ''
          let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

          for (let i = 0; i < length; i++) {
            key += possible.charAt(Math.floor(Math.random() * possible.length))
          }

          return key
        }

        warns[caseid] = {
          'admin': {
            'name': message.author.username,
            'discrim': message.author.discriminator,
            'id': message.author.id
          },
          'user': {
            'name': usr.username,
            'discrim': usr.discriminator,
            'id': usr.id
          },
          'server': {
            'name': message.guild.name,
            'id': message.guild.id,
            'channel': message.channel.name,
            'channel_id': message.channel.id
          },
          'reason': rsn
        }
        message.channel.send(usr + ' was warned for `' + rsn + '`, check logs for more info')
        fs.writeFile('./data/warns.json', JSON.stringify(warns))
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}warn .${rb}`)
      } else {
        message.channel.send('You need to have permisson to kick/ban members to use this command!')
      }
    }

    if (message.content.startsWith(prefix + 'say')) {
      if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) !== -1) {
        var say = message.content.split(' ').splice(1).join(' ')
        message.delete()
        message.channel.send(say)
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}say .${rb}`)
      }
    }
    if (message.content.startsWith(prefix + 'serverinfo')) {
      message.channel.send(`Region: **${message.guild.region}**\nTotal Users: **${message.guild.memberCount}**\nOwner: **${message.guild.owner.username}#${message.guild.owner.discriminator}**\nText Channels: **${message.guild.channels.size}**\nVoice Channels: **${message.guild.voiceChannel}**\nRoles: **${message.guild.roles.size}**\nVerification Level: **${message.guild.verificationLevel}**\nID: **${message.guild.id}**`)
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}serverInfo .${rb}`)
    }
    if (message.content.startsWith(prefix + 'remindme')) {
      let args = message.content.split(' ').slice(1)
      if (!args) message.channel.send('you need to specify what you want to be reminded with.')
      let time1 = args[0]
      if (!time1) message.channel.send('You need to specify time.')
      let args1 = args.slice(1).join(' ')
      message.channel.send('Got it :ok_hand: , gonna remind in **' + time1 + '**')
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}remindme .${rb}`)
      console.log(args)

      setTimeout(function () {
        message.author.send('You have requested me to remind you with:** ' + args1 + ' **in **' + time1 + '**')
      }, ms(time1))
    }

    if (message.content.startsWith(prefix + 'mute')) {
      if (message.author.id === config.owner_id || message.member.permissions.has('ADMINISTRATOR')) {
        let member = message.mentions.members.first()
        if (!member) return message.channel.send('You need to mention a user!')
        let muteRole = message.guild.roles.find('name', 'Muted')
        if (!muteRole) {
          return message.guild.createRole({
            name: 'Muted',
            color: 'RED',
            hoist: false,
            position: 5,
            mentionable: true,
            permissions: {
              READ_MESSAGES: true,
              SEND_MESSAGES: false,
              SEND_TTS_MESSAGES: false,
              CONNECT: false,
              SPEAK: false
            }
          })
        }
        let args = message.content.split(' ').slice(1)
        let time = args[1]
        if (!time) return message.channel.send('ther is no time specified.')

        member.addRole(muteRole.id)
        bot.users.find('id', message.mentions.members.first().id).send(`You have been mutted for** ${time} ** in ${message.guild.name}.`)
        message.channel.send('muted the user.')
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}mute .${rb}`)

        setTimeout(function () {
          member.removeRole(muteRole.id)
          bot.users.find('id', message.mentions.members.first().id).send(`You have been unmutted.`)
          message.channel.send('unmuted the user.')
        }, ms(time))
      } else {
        message.channel.send('you dont have permisson to run this command.')
      }
    }
    if (message.content.startsWith(prefix + 'unmute')) {
      if (message.author.id === config.owner_id || message.member.permissions.has('ADMINISTRATOR')) {
        let member = message.mentions.members.first()
        if (!member) return message.channel.send('You need to mention a user!')
        let muteRole = message.guild.roles.find('name', 'Muted')

        member.removeRole(muteRole.id)
        bot.users.find('id', message.mentions.members.first().id).send(`You have been unmutted in ${message.guild.name}.`)
        message.channel.send(`unmuted the user.`)
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}unmute .${rb}`)
      } else {
        message.channel.send('you dont have permisson to run this command.')
      }
    }
    if (message.content.startsWith(prefix + 'review')) {
      let args = message.content.split(' ').splice(1).join(' ')
      if (!args) message.channel.send(`you need to specify a txt after **${prefix}review**`)
      const id = bot.guilds.get('283893701023891466')
      if (!id) message.channel.send('couldnt find the dev server')
      const channel = bot.channels.get('283906210049163265')
      if (!channel) message.channel.send('couldnt find the channel')
      bot.guilds.get('283893701023891466').channels.get('283906210049163265').send('FeedBack sent by: **' + message.author.username + '** ' + args + ' at ' + '**[ ' + new Date() + ' ]**')
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}review .${rb}`)
      message.channel.send('FeedBack Successfully send.')
    }
    if (message.content.startsWith(prefix + 'disable')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || message.member.permissions.has('ADMINISTRATOR')) {
        array.push(message.guild.id)
        message.channel.send('Disabled.')
        array.splice(array.indexOf(message.guild.id))
        fs.writeFile('./data/disable.json', JSON.stringify(array), function (err) { if (err) { return console.log(err) } })
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}enable .${rb}`)
      } else {
        message.channel.send('you dont have permisson to use this command.')
      }
    }
    if (message.content.startsWith(prefix + 'swearEnable')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || message.member.permissions.has('ADMINISTRATOR')) {
        var index1 = array1.indexOf(message.guild.id)
        array1.splice(index1, 1)
        message.channel.send('Enabled.')
        array1.push(message.guild.id)
        fs.writeFile('./data/disableS.json', JSON.stringify(array1), function (err) { if (err) { return console.log(err) } })

        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}enableSwear .${rb}`)
      } else {
        message.channel.send('you dont have permisson to use this command.')
      }
    }
    if (message.content.startsWith(prefix + 'swearDisable')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || message.member.permissions.has('ADMINISTRATOR')) {
        array1.push(message.guild.id)
        message.channel.send('Disabled.')
        array1.splice(array1.indexOf(message.guild.id))
        fs.writeFile('./data/disableS.json', JSON.stringify(array1), function (err) { if (err) { return console.log(err) } })

        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}disable .${rb}`)
      } else {
        message.channel.send('you dont have permisson to use this command.')
      }
    }

    if (message.content.startsWith(prefix + 'enable')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || message.member.permissions.has('ADMINISTRATOR')) {
        var index = array.indexOf(message.guild.id)
        array.splice(index, 1)
        message.channel.send('Enabled.')
        array.push(message.guild.id)
        fs.writeFile('./data/disable.json', JSON.stringify(array), function (err) { if (err) { return console.log(err) } })
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}disable .${rb}`)
      } else {
        message.channel.send('you dont have permisson to use this command.')
      }
    }
    if (message.content.startsWith(prefix + 'eval')) {
      if (isCommander(message.author.id)) {
        try {
          let code = message.content.split(' ').splice(1).join(' ')
          let result = eval(code)
          message.channel.send('```diff\n+ ' + result + '```')
          bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}eval .${rb}`)
        } catch (err) {
          message.channel.send('```diff\n- ' + err + '```')
        }
      } else {
        message.channel.send('Sorry, you do not have permissisons to use this command, **' + message.author.username + '**.')
      }
    }

    if (message.content.startsWith(prefix + 'volume')) {
      let suffix = message.content.split(' ')[1]
      var player = message.guild.voiceConnection.player.dispatcher
      if (!player || player.paused) return message.channel.send('No music m8, queue something with `' + prefix + 'play`')
      if (!suffix) {
        message.channel.send(`The current volume is ${(player.volume * 100)}`)
      } else if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || config.admins.indexOf(message.author.id) !== -1) {
        let volumeBefore = player.volume
        let volume = parseInt(suffix)
        if (volume > 100) return message.channel.send("The music can't be higher then 100")
        player.setVolume((volume / 100))
        message.channel.send(`Volume changed from ${(volumeBefore * 100)} to ${volume}`)
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}volume .${rb}`)
      } else {
        message.channel.send('Only admins can change the volume!')
      }
    }
    if (message.content.startsWith(prefix + 'kill')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id) {
        message.channel.send('i didnt iven want to be here')
        message.guild.leave()
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}kill .${rb}`)
      }
    }

    if (message.content.startsWith(prefix + 'resume')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || message.member.permissions.has('ADMINISTRATOR') || config.admins.indexOf(message.author.id) !== -1) {
        let player = message.guild.voiceConnection.player.dispatcher
        if (!player) return message.channel.send('No music is playing at this time.')
        if (player.playing) return message.channel.send('The music is already playing')
        var queue = getQueue(message.guild.id)
        bot.user.setGame(queue[0].title)
        player.resume()
        message.channel.send('Resuming music...')
        bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}resume .${rb}`)
      } else {
        message.channel.send('Only admins can do this command')
      }
    }

    if (message.content.startsWith(prefix + 'invite')) {
      message.channel.send('My OAuth URL: ' + `http://discordapp.com/oauth2/authorize?client_id=${config.client_id}&scope=bot&permissions=8`)
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}invite .${rb}`)
    }

    if (message.content.startsWith(prefix + 'about')) {
      var cdb = '```'
      var msg = (`${cdb}fix
Hello,im Mayumi-San! To see all my commands type ${prefix}help.
${cdb}`)
      message.channel.send(msg)
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}about .${rb}`)
    }

    if (message.content.startsWith(prefix + 'np') || message.content.startsWith(prefix + 'nowplaying')) {
      let queue = getQueue(message.guild.id)
      if (queue.length === 0) return message.channel.send(message, 'No music in queue')
      message.channel.send(`${rb}xl\nCurrently playing: ${queue[0].title} | by ${queue[0].requested}${rb}`)
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}np .${rb}`)
    }
    if (message.content.startsWith(prefix + 'queue')) {
      let queue = getQueue(message.guild.id)
      if (queue.length === 0) return message.channel.send('No music in queue')
      let text = ''
      for (let i = 0; i < queue.length; i++) {
        text += `${(i + 1)}. ${queue[i].title} | requested by ${queue[i].requested}\n`
      };
      message.channel.send(`${rb}xl\n${text}${rb}`)
      bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}queue .${rb}`)
    }
    if (message.content.startsWith(prefix + 'announce ', '')) {
      if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) !== -1) {
        console.log(object)
        var tmp = bot.guilds.map(g => g.id)

        var args = message.content.replace(prefix + 'announce ', '')
        var GuildIDS = bot.guilds.map(x => x.id)
        for (i = 0; i < GuildIDS.length; i++) {
          if (!array.includes(GuildIDS[i])) {
            if (!object.hasOwnProperty(GuildIDS[i])) {
              bot.channels.get(bot.guilds.get(GuildIDS[i]).defaultChannel.id).send(args)
              bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}announce .${rb}`)
            } else {
              if (!array.includes(GuildIDS[i])) {
                bot.channels.get(object[GuildIDS[i]]).send(args)
                bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}announce .${rb}`)
              }
            }
          }
        }
      } else {
        message.channel.send('Only Owner can use this command.')
      }
    }
  } catch (err) {
    bot.guilds.get('283893701023891466').channels.get('354671958346170369').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Bot CRASHED!!${rb}`)
    console.log('WELL LADS LOOKS LIKE SOMETHING WENT WRONG!' + err.stack)
    errorlog[String(Object.keys(errorlog).length)] = {
      'code': err.code,
      'error': err,
      'stack': err.stack
    }
    fs.writeFile('./data/errors.json', JSON.stringify(errorlog), function (err) {
      if (err) return console.log("Even worse we couldn't write to our error log file! Make sure data/errors.json still exists!")
    })
  }
})

bot.login(config.token)

process.on('unhandledRejection', err => {
  console.error('Uncaught We had a promise error \n' + err.stack)
})
