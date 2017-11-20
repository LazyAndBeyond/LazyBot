 
const Discord = require('discord.js')
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
const swearWords = ['fuck', 'shit', 'Shit ', 'SHIT', 'FUCK', 'dick', 'pussy', 'fuck off', 'fuck you', 'fucking', 'cunt', 'faggot', 'ass', 'asshole']
const bot = new Discord.Client({autoReconnect: true})
const notes = require('./data/notes.json')
const prefix = config.prefix
const os = require('os')
const rb = '```'
const music = require('discord.js-music-v11');
const sbl = require('./data/blservers.json')
const ubl = require('./data/blusers.json')
const fs = require('fs')
const warns = require('./data/warns.json')
const queues = {}
const snekfetch = require("snekfetch")
const ytdl = require('ytdl-core')
const search = require('youtube-search')
const ms = require('ms')
const neko = require('neko.js')
const giphy = require('quick-giphy')
const randomAnimeWallpapers = require('random-anime-wallpapers')
const http = require('http')
const express = require('express')
const app = express()
const Cleverbot = require('cleverbot-node')
const clbot = new Cleverbot()
const started = Date()
const time = new Date()
const errorlog = require('./data/errors.json')
const array1 = require('./data/disableS')
const object = require('./data/default.json')
const prefixes = JSON.parse(fs.readFileSync('./data/prefixes.json'))
clbot.configure({botapi: 'CC43sDxdsPJDs4as2DVngVwWPEA'})
const nekoclient = new neko.Client({
  key: 'dnZ4fFJbjtch56pNbfrZeSRfgWqdPDgf'
})
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

function getRandomHex () {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

function getRandomInt () {
  return Math.floor(Math.random() * 16777215).toString(10)
}

bot.on('ready', function () {
  try {
    config.client_id = bot.user.id
    bot.user.setStatus('online', config.status)
    bot.user.setGame(prefix + 'help , in ' + bot.guilds.size + ' servers! with ' + bot.users.size + ' users!')
    bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb} [ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Logging in to Discord${rb}`)
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
      const errorlog = {}
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
  bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb} [ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Joined: "${guild.name}" (id: "${guild.id}"). \nWith: "${guild.memberCount}" members!${rb}`)
  bot.user.setGame(prefix + 'help , in ' + bot.guilds.size + ' servers! With ' + bot.users.size + ' members!')
  let muteRole = guild.roles.find(r => r.name === 'Muted')
  if (!muteRole) {
    try {
      muteRole = guild.createRole({
        name: 'Muted',
        color: 'BLACK',
        position: 5,
        permissions: []
      })
    } catch (error) {
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(error)
    }
  }
  guild.channels.map((channel, id) => {
    channel.overwritePermissions(muteRole, {
      SEND_MESSAGES: false,
      ADD_REACTIONS: false
    })
  })
  bot.on('guildDelete', guild => {
    bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb} [ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Leaft: "${guild.name}" (id: "${guild.id}")${rb}`)
    bot.user.setGame(prefix + 'help , in ' + bot.guilds.size + ' servers! With ' + bot.users.size + ' members!')
  })
})
app.get('/', (request, response) => {
  response.sendStatus(200)
})
app.listen(process.env.PORT)
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`)
}, 280000)
bot.on('message', function async (message) {
  try {
    if (message.author.bot) return
    if (message.channel.type === 'dm') {
      clbot.write(message.content, (response) => {
        message.channel.startTyping()
        setTimeout(() => {
          message.channel.send(response.output).catch(console.error)
          message.channel.stopTyping()
        }, Math.random() * (1 - 3) + 1 * 1000)
      })
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> \nUser:${message.author.username} (id:${message.author.id}) \n  Command: CleverBot .${rb}`)
      return
    }
    if (sbl.indexOf(message.guild.id) !== -1 && message.content.startsWith(prefix)) {
      return
    }
    if (ubl.indexOf(message.author.id) !== -1 && message.content.startsWith(prefix)) {
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
      message.channel.send(':ping_pong: Pong!').then(function (msg) {
        var after = Date.now()
        msg.edit(':ping_pong: Pong! **' + (after - before) + '**ms')
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}ping .${rb}`)
      })
    }

    if (message.content.startsWith(prefix + 'help')) {
      const rbb = '`'
const help = new Discord.RichEmbed()
.setTitle(`Pick A Command Module From Mayumi's Help command`)
.setColor(getRandomHex())
.setThumbnail(bot.user.displayAvatarURL)
.addField(`Music:`, `${rb}js\nMusic commands....\n${rb}`)
.addField(`Moderation:`, `${rb}js\nAll the moderation commands of the bot.\n${rb}`)
.addField(`Fun:`, `${rb}js\nAll the fun commands are listed in ther.\n${rb}`)
.addField(`Owner/Admins:`, `${rb}js\nAll Owner/Admins of the bot commands are ther.\n${rb}`)
.addField(`How to Use?`, `${rbb}${prefix}help ModuleName${rbb}`)
.addField(`Support Server:`, `**https://discord.gg/fKBvnPq**`)
.addField(`Invite URL:`, `**http://discordapp.com/oauth2/authorize?client_id=358198916539482112&scope=bot&permissions=8**`)
.addField(`Developer Notes:`, `Cleverbot system only works with DM's or with mentioning the bot with a message ex:(<@358198916539482112> Hi!)`)
const embed = new Discord.RichEmbed()
.addField(`Mayumi-San's Help Command page 1 :`, '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')

.setColor(getRandomHex())
.setThumbnail(bot.user.displayAvatarURL)
.addField(`Music Commands:`, `__**${prefix}help**__ - Shows this message.
__**${prefix}play**__ <args> - Plays the song you requested.
__**${prefix}volume**__ <volume> - Change the volume.
__**${prefix}queue**__ - Check the list of songs that are queued.
__**${prefix}np**__ - Check the current song out (nowplaying).
__**${prefix}skip**__ - Skips the playing song.
__**${prefix}pause**__ - Pause the current song.
__**${prefix}clearqueue**__ - Clears the list of queues.
__**${prefix}resume**__ - Resumes paused song.`)

const embed1 = new Discord.RichEmbed()
.setColor(getRandomHex())
.addField(`Mayumi-San's Help Command page 2 :`, '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
.addField(`Moderation Commands:`, `__**${prefix}kill**__ - the bot leaves your server (server owner only).
__**${prefix}warn <user> <reason>**__ - Warns a user for the thing they did wrong.
__**${prefix}resetwarn <user>**__ - Deletes a warning from a user.
__**${prefix}checkwarn <user>**__ - Lookup warning information on a user.
__**${prefix}kick <mention> <reason>**__ - kick a member from the server.
__**${prefix}ban <mention> <reason>**__ - ban a member from the server.
__**${prefix}purge <0/100> **__ - deletes messages (cant delete messages wich are more than 2 weeks old).
__**${prefix}swearEnable**__ - enables swear auto detect system.
__**${prefix}swearDisable**__ - disables swear auto detect system.
__**${prefix}mute <mention> <time>**__ - mutes a member.
__**${prefix}unmute <mention>**__ - unmutes a member (only if he is already muted).
__**${prefix}review <args>**__ - send a review to the bot dev server.`)

const embed2 = new Discord.RichEmbed()
.setColor(getRandomHex())
.addField(`Mayumi-San's Help Command page 3 :`, '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
.addField(`Fun Commands:`, `__**${prefix}remindme <time> <args>**__ - Reminds you of something in a certain time.
__**${prefix}note <your_note>**__- Takes a note.
__**${prefix}about**__ - Info about the bot.
__**${prefix}invite**__ - Creates OAuth URL for bot.
__**${prefix}emojis**__ - give you all comstume emojis in the server (only costume emojis).
__**${prefix}say <args>**__ - says what you told her to say.
__**${prefix}mynotes**__ - Shows notes you have taken.
__**${prefix}ping**__ - Ping/Pong with ms amount.
__**${prefix}servers**__ Shows amount of servers.
__**${prefix}uptime**__ - Shows bot uptime.
__**${prefix}sys**__ - Gets system information.
__**${prefix}serverInfo**__ - Gets the server info.
__**${prefix}why**__ - sends a question.
__**${prefix}support**__ - gives you the bot support server.
__**${prefix}avatar <mention>**__ - gives you someones avatar.
__**${prefix}DM <mention>**__ - DM a personne.
__**${prefix}math <num1> <marks> <num2 - Math's something for you (SPACES ARE REQUIRED!!).
__**${prefix}8ball <args>**__ - question - answer.`)
.addField(`More Fun Commands:`, `__**${prefix}kiss <mention>**__ - gives you a kiss gif.
__**${prefix}hug <mention>**__ - gives you a hug gif.
__**${prefix}pat <mention>**__ - gives you a pat gif.
__**${prefix}neko**__ - gives you a neko gif.
__**${prefix}Cats**__ - Random Cats Pics.
__**${prefix}LewdNeko**__ - gives you a LewdNeko pic.
__**${prefix}lizard**__ - gives you a lizard pic.
__**${prefix}wallpapers <args>**__ - sends a wallpaper of what you asked for. 
__**${prefix}gifs <args>**__ - sends a gif. `)

const embed3 = new Discord.RichEmbed()
.setColor(getRandomHex())
.addField(`Mayumi-San's Help Command page 4 :`, '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
.addField(`Owner/Admins Commands:`, `__**${prefix}userblacklist**__ <add/remove> <user id> - Blacklists a user.
__**${prefix}serverblacklist <add/remove> <server id>**__ - Adds or removes servers from blacklist.
__**${prefix}shutdown**__ - Power off the bot (Owner only).
__**${prefix}restart**__ - Restarts the bot
__**${prefix}eval <code>**__ - (Owner only).
__**${prefix}setName <name>**__ - change the bot name (Owner only).`)
      const args = message.content.split(' ').splice(1)
      if (!args[0]) return message.channel.send(help)
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}help .${rb}`)
      if (args[0] === 'Music' || 'Music'.toLowerCase()) { 
        message.author.send(embed)
        message.channel.send(`**${message.author.username}** Check Your DM's :mailbox_with_mail: !`)
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}help Music .${rb}`)
      } else {
        if (args[0] === 'Moderation' || 'Mod' || 'Moderation'.toLowerCase() || 'Mod'.toLowerCase()) {
          message.author.send(embed1)
          message.channel.send(`**${message.author.username}** Check Your DM's :mailbox_with_mail: !`)
          bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}help Moderation .${rb}`)
        } else {
          if (args[0] === 'Fun' || 'Fun'.toLowerCase) {
            message.author.send(embed2)
            message.channel.send(`**${message.author.username}** Check Your DM's :mailbox_with_mail: !`)
            bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}help Fun .${rb}`)
          } else {
            if (args[0] === 'Owner/Admins' || 'Owner' || 'Admins' || 'Owner'.toLowerCase() || 'Admins'.toLowerCase) {
              message.author.send(embed3)
              message.channel.send(`**${message.author.username}** Check Your DM's :mailbox_with_mail: !`)
              bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}help Owner/Admins .${rb}`)
            }
          }
        }
      }
    }
    if (message.content.startsWith(prefix + 'Cats' || prefix + 'Cats'.toLowerCase())) {
      snekfetch.get("http://random.cat/meow")
      .then((res) => {
      let embed = new Discord.RichEmbed()
      .setTitle(`Some Random Cats`)
      .setImage(res.body.file)
      .setTimestamp()
      .setFooter('Requested At:',bot.user.displayAvatarURL)
      message.channel.send(embed)
      }
     )
    }
    if (message.content.startsWith(prefix + 'giveaway')) {
      const myArray = []
      
    }
    if (message.content.startsWith(prefix + 'math')) {
      let args = message.content.split(' ').splice(1)
      let num1 = parseInt(args[0])
      let num2 = parseInt(args[2])
      if (args[1] === '+') {
        var ans = num1 + num2
        var embed = new Discord.RichEmbed()
          .setColor(getRandomHex())
          .setTitle(`I CAN USE MATH!!!`)
          .setThumbnail(bot.user.diplayAvatarURL)
          .addField(`Your Answer:`, `:mortar_board: ${rb}js\n${ans}\n${rb}  `)
          .setFooter('Requested at: ', bot.user.displayAvatarURL)
          .setTimestamp()
          message.channel.send(embed);
      } else {
        if (args[1] === '-') {
          var ans1 = num1 - num2
          var embed1 = new Discord.RichEmbed()
          .setColor(getRandomHex())
          .setTitle(`I CAN USE MATH!!!`)
          .setThumbnail(bot.user.diplayAvatarURL)
          .addField(`Your Answer:`, `:mortar_board: ${rb}js\n${ans1}\n${rb}  `)
          .setFooter('Requested at: ', bot.user.displayAvatarURL)
          .setTimestamp()
          message.channel.send(embed1);
        } else {
          if (args[1] === '/') {
            var ans2 = num1 / num2
            var embed2 = new Discord.RichEmbed()
          .setColor(getRandomHex())
          .setTitle(`I CAN USE MATH!!!`)
          .setThumbnail(bot.user.diplayAvatarURL)
          .addField(`Your Answer:`, `:mortar_board: ${rb}js\n${ans2}\n${rb}  `)
          .setFooter('Requested at: ', bot.user.displayAvatarURL)
          .setTimestamp()
          message.channel.send(embed2);
          } else {
            if (args[1] === '*') {
                          var ans3 = num1 * num2
            var embed3 = new Discord.RichEmbed()
          .setColor(getRandomHex())
          .setTitle(`I CAN USE MATH!!!`)
          .setThumbnail(bot.user.diplayAvatarURL)
          .addField(`Your Answer:`, `:mortar_board: ${rb}js\n${ans3}\n${rb}  `)
          .setFooter('Requested at: ', bot.user.displayAvatarURL)
          .setTimestamp()
          message.channel.send(embed3);
            }
          }
      }
    }
                  bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}math .${rb}`)
    }
    if (message.content.startsWith(prefix + 'lockdown')) {
if (!bot.lockit) bot.lockit = [];
  let time = args.join(' ');
  let validUnlocks = ['release', 'unlock'];
  const embed = new Discord.RichEmbed()
  .setColor(getRandomHex())
  .setTimestamp()
  .addField('Action:', 'Lockdown')
  .addField('Channel:', message.channel)
  .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
  .addField('Time:', `${ms(ms(time), { long:true })}`);
  if (!time) return message.reply('You must set a duration for the lockdown in either hours, minutes or seconds');

  if (validUnlocks.includes(time)) {
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: null
    }).then(() => {
      message.channel.send('Lockdown lifted.');
      clearTimeout(bot.lockit[message.channel.id]);
      delete bot.lockit[message.channel.id];
    }).catch(error => {
      console.log(error);
    });
  } else {
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: false
    }).then(() => {
      message.channel.send({ embed: embed }).then(() => {

        bot.lockit[message.channel.id] = setTimeout(() => {
          message.channel.overwritePermissions(message.guild.id, {
            SEND_MESSAGES: null
          }).then(message.channel.sendMessage('Lockdown lifted.')).catch(console.error);
          delete bot.lockit[message.channel.id];
        }, ms(time));

      }).catch(error => {
        console.log(error);
      });
    });
  }
            bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}lockdown .${rb}`)
}
    if (message.content.startsWith(prefix + 'prefix')) {
      let args = message.content.split(' ').splice(1)
      let guildData = prefixes[message.guild.id]
      if (!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
          prefix: args[0],
          guild_id: message.guild.id
        }
        fs.writeFile('./data/prefixes.json', JSON.stringify(prefixes), (err) => {
      if (err) console.error(err)
    })
    }
    }
    if (message.content.startsWith(prefix + 'kiss')) {
      let user = message.mentions.users.first()
      if (!user) return message.channel.send('O_o you wanna kiss yourself??')
      nekoclient.kiss().then((kiss) => message.channel.send(`**${user}** , **${message.author.username}** kissed you! \n`, {
        embed: {
          color: getRandomInt(),
          image: {
            url: kiss.url
          }
        }

      }).catch(e => console.warn('wew tf happened here ' + e)))

      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}help .${rb}`)
    }

    if (message.content.startsWith(prefix + 'pat')) {
      let user = message.mentions.users.first()
      if (!user) return message.channel.send('O_o you wanna pat yourself??')

      nekoclient.pat().then((pat) => message.channel.send(`**${user}** , **${message.author.username}** patted you! \n`, {
        embed: {
          color: getRandomInt(),
          image: {
            url: pat.url
          }
        }

      }).catch(e => console.warn('wew tf happened here ' + e)))
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}pat .${rb}`)
    }
    if (message.content.startsWith(prefix + 'hug')) {
      let user = message.mentions.users.first()
      if (!user) return message.channel.send('O_o you wanna hug yourself??')

      nekoclient.hug().then((hug) => message.channel.send(`**${user}** , **${message.author.username}** patted you! \n`, {
        embed: {
          color: getRandomInt(),
          image: {
            url: hug.url
          }
        }

      }).catch(e => console.warn('wew tf happened here ' + e)))
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}hug .${rb}`)
    }
    if (message.content.startsWith(prefix + 'neko')) {
      nekoclient.neko().then((neko) => message.channel.send({
        embed: {
          color: getRandomInt(),
          image: {
            url: neko.neko
          }
        }

      }).catch(e => console.warn('wew tf happened here ' + e)))
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}neko .${rb}`)
    }
    if (message.content.startsWith(prefix + 'why')) {
      nekoclient.why().then((why) => message.channel.send(why.why))
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}why .${rb}`)
    }
    if (message.content.startsWith(prefix + 'lewdNeko')) {
      if (message.channel.nsfw) {
        nekoclient.LewdNeko().then((LewdNeko) => message.channel.send({
          embed: {
            color: getRandomInt(),
            image: {
              url: LewdNeko.neko
            }
          }

        }).catch(e => console.warn('wew tf happened here ' + e)))
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}lewdNeko .${rb}`)
      } else {
        message.channel.send('this command only work on nsfw channels')
      }
    }
    if (message.content.startsWith(prefix + 'lizard')) {
      nekoclient.lizard().then((lizard) => message.channel.send({
        embed: {
          color: getRandomInt(),
          image: {
            url: lizard.url
          }
        }

      }).catch(e => console.warn('wew tf happened here ' + e)))
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}lizard .${rb}`)
    }
    if (message.content.startsWith(prefix + 'support')) {
      message.channel.send({
        embed: {
          author: {
            name: message.author.username,
            icon_url: message.author.avatarURL
          },
          title: `Invite Link`,
          description: `[Invite me!](http://discordapp.com/oauth2/authorize?client_id=${config.client_id}&scope=bot&permissions=8)\n[Support Server!](https://discord.gg/fKBvnPq)`,
          color: getRandomInt,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.displayAvatarURL,
            text: 'Requested at:'
          }}})

      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}support .${rb}`)
    }
    if (message.content.startsWith(prefix + 'restart')) {
      if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) !== -1) {
        message.channel.send('Restart has been initiated.\n**Restaring...**')
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Restarting......${rb}`)
        setTimeout(function () {
          bot.destroy()
        }, 1000)
        setTimeout(function () {
          process.exit()
        }, 2000)
      } else {
        message.channel.send('you dont have permisson to run this command')
      }
    }
    if (message.content.startsWith(prefix + '8ball')) {
      var answer = Math.floor(Math.random() * 2) + 1
      if (answer === 1) {
        message.channel.send(':white_check_mark: **Yes!**')
      } else {
        message.channel.send(':x: **No!**')
      }
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}8ball .${rb}`)
    }
    if (message.content.startsWith(`<@${bot.user.id}>`)) {
      clbot.write(message.content, (response) => {
        message.channel.startTyping()
        setTimeout(() => {
          message.channel.send(response.output).catch(console.error)
          message.channel.stopTyping()
        }, Math.random() * (1 - 3) + 1 * 1000)
      })
    }
    if (message.content.startsWith(prefix + 'wallpapers')) {
      let args = message.content.split(' ').splice(1)
      randomAnimeWallpapers(args)
      .then(images => {
        let img = images[Math.floor(Math.random() * images.length)]
        if (!img) return message.channel.send('no result fund for **' + args + '**')
        message.channel.send({
          embed: {
            color: getRandomInt(),
            image: {
              url: img.full
            }
          }

        }).catch(e => console.warn('wew tf happened here ' + e))
      })
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}wallpapers .${rb}`)
    }
    if (message.content.startsWith(prefix + 'gifs')) {
      let args = message.content.split(' ').splice(1)

      giphy({apiKey: 'P66vSybfG3Deu1DBHYc8vNnRwKHuV3d5', query: args})
  .then(url => {
    message.channel.send({
      embed: {
        color: getRandomInt(),
        image: {
          url: url
        }
      }

    }).catch(e => console.warn('wew tf happened here ' + e))
  })
    }
    if (message.content.startsWith(prefix + 'setName')) {
      if (message.author.id === config.owner_id) {
        let name = message.content.split(' ').splice(1).join(' ')
        if (!name) message.channel.send('you need to specify a name.')
        console.log('Bot name got setted to ' + name)
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}setName .${rb}`)
        bot.user.setUsername(name)
        message.channel.send('✔ Username setted!')
      } else {
        message.channel.send('you dont have permisson to run this command.')
      }
    }
    if (message.content.startsWith(prefix + 'avatar')) {
      let user = message.mentions.users.first()
      if (!user) message.channel.send('you need to mention a user')
      let avatar = user.displayAvatarURL
      let embed = new Discord.RichEmbed()

      .setAuthor('Avatar requested by: ' + message.author.username)
      .setColor(getRandomHex())
      .setImage(avatar)
      .setFooter('Requested at: ', bot.user.displayAvatarURL)
      .setTimestamp()

      message.channel.send({embed: embed})

      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}avatar .${rb}`)
    }
    if (message.content.startsWith(prefix + 'userInfo')) {
      let user = message.mentions.users.first()
      if (!user) return message.channel.send('you need to mention a user!')
      let embed = new Discord.RichEmbed()

      .setAuthor(message.author.username + ' requested user info of ' + user.username)
      .setDescription(`**${user.username}**'s Profile Info's`)
      .setColor(getRandomHex())
      .setThumbnail(user.displayAvatarURL)
      .addField('Statu:', `**${message.member.presence.status}**`)
      .addField('Game', `**${message.author.presence.game.name}**`)
      .addField('Full Username:', `**${user.username}**`)
      .addField('ID:', `**${user.id}**`)
      .addField('Created At:',  `**${user.createdAt}**`)
      .addField('lastMessage Content:', `**${user.lastMessageID.content}**`)
      .setFooter('Requested at: ', bot.user.displayAvatarURL)
      .setTimestamp()

      message.channel.send({embed: embed})
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}userinfo .${rb}`)
    }
    if (message.content.startsWith(prefix + 'servers')) {
      message.channel.send("I'm currently on **" + bot.guilds.size + '** Server(s) ,with **' + bot.users.size + '** Members')
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}servers .${rb}`)
    }
    if (message.content.startsWith(prefix + 'DM')) {
      let args = message.content.split(' ').splice(1)
      if (!args) return message.channel.send('you specify what should i send.')
      let memeber = message.mentions.members.first()
      if (!memeber) return message.channel.send('you need add a mention to the command dummy.')
      let args1 = args.slice(1).join(' ')
      if (!args1) return message.channel.send('You need to add something to send')
      const embed = new Discord.RichEmbed()
      .setAuthor(message.author.username + 'sended you a DM!')
      .setDescription('DM been sent to you!')
      .setColor(getRandomHex())
      .setThumbnail(message.author.displayAvatarURL)
      .setFooter('DM been sent at: ', bot.user.displayAvatarURL)
      .setTimestamp()
      .addField('Content:', args1)

      bot.users.find('id', message.mentions.members.first().id).send({embed: embed})

      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}DM .${rb}`)
      message.channel.send('DM Successfuly sent!')
      message.delete()
    }

    if (message.content.startsWith(prefix + 'emojis')) {
      let emojiList = message.guild.emojis.map(e => e.toString()).join(' ')
      if (!emojiList) return message.channel.send('you have no costume emojis in your guild!')

      message.channel.send(`Here are** ${message.guild.name} **Emojis: \n${emojiList}`)
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}emojis .${rb}`)
    }
    if (message.content === prefix + 'uptime') {
      message.channel.send('I have been up for `' + secondsToString(process.uptime()) + '` - My process was started at this time --> `' + started + '`')
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}uptime .${rb}`)
    }
    if (message.content.startsWith(prefix + 'play')) {
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}play .${rb}`)
    }
    if (message.content.startsWith(prefix + 'sys')) {
      let embed = new Discord.RichEmbed()
      .setColor(getRandomHex())
      .setThumbnail(bot.user.displayAvatarURL)
      .setAuthor(bot.user.username + ' System Information!')
      .addField('Sytem Info:', `${rb}js\n${process.platform}-${process.arch} with ${process.release.name} version ${process.version.slice(1)}\n${rb}`)
      .addField('Process Info:', `${rb}js\nPID ${process.pid} at ${process.cwd()}\n${rb}`)
      .addField('Process memory usage:', `${rb}js\n${Math.ceil(process.memoryUsage().heapTotal / 1000000)} MB\n${rb}`)
      .addField('System memory usage:', `${rb}js\n${Math.ceil((os.totalmem() - os.freemem()) / 1000000)} of ${Math.ceil(os.totalmem() / 1000000)} MB\n${rb}`)
      .addField('Bot Info:', `${rb}js\nFull Name: ${bot.user.username}\nID: ${bot.user.id}\nCharacterLimit: ${2000}\nServers: ${bot.guilds.size}\nChannels: ${bot.channels.size}\nUsers: ${bot.users.size}${rb}`)
      .addField('Owner/Admins:', `${rb}js\nOwner_ID: ${config.owner_id}\nAdmins_ID: ${config.admins}${rb}`)

      message.channel.send(embed)
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
          bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}serverblacklist remove .${rb}`)
        } else if (args[0] === 'add') {
          sbl.push(args[1])
          fs.writeFile('./data/blservers.json', JSON.stringify(sbl), function (err) { if (err) { return console.log(err) } })
          message.channel.send('Server have been added to blacklist.')
          bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}serverblacklist add .${rb}`)
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
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}note .${rb}`)
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
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}kick .${rb}`)
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
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}ban .${rb}`)
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
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}mynotes .${rb}`)
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
          bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}userblacklist remove .${rb}`)
        } else if (args[0] === 'add') {
          ubl.push(args[1])
          fs.writeFile('./data/blusers.json', JSON.stringify(ubl), function (err) { if (err) { return console.log(err) } })
          message.channel.send('User have been added to blacklist.')
          bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}userblacklist add .${rb}`)
        } else {
          message.channel.send(`You need to specify what to do! ${prefix}userlacklist <add/remove> <user id>`)
        }
      } else {
        message.channel.send('Sorry, this command is for the owner only.')
      }
    }

    if (message.content.startsWith(prefix + 'clearqueue')) {
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}clearqueue .${rb}`)
    }

    if (message.content.startsWith(prefix + 'checkwarn')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || config.admins.indexOf(message.author.id) !== -1 || message.member.permissions.has('ADMINISTRATOR')) {
        let user = message.mentions.users.array()[0]
        if (!user) return message.channel.send('You need to mention the user')
        let list = Object.keys(warns)
        let found = ''
        let foundCounter = 0
                // looking for the case id
        for (let i = 0; i < list.length; i++) {
          if (warns[list[i]].user.id === user.id) {
            foundCounter++
            found += `${(foundCounter)}. Username: ${warns[list[i]].user.name}\nAdmin: ${warns[list[i]].admin.name}\nServer: ${warns[list[i]].server.name}\nReason: ${warns[list[i]].reason}\n`
          }
        }
        if (foundCounter === 0) return message.channel.send('No warns recorded for that user')
        message.channel.send(`Found ${foundCounter} warns\n ${found}`)
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}checkwarn .${rb}`)
      } else {
        message.channel.send('Only the admins can do this command')
      }
    }
    if (message.content.startsWith(prefix + 'setdefault')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || config.admins.indexOf(message.author.id) !== -1 || message.member.permissions.has('ADMINISTRATOR')) {
        object[message.guild.id] = message.channel.id
        message.channel.send('Default channel setted to ' + message.channel.name)
        object[message.guild.id] = message.channel.id
        fs.writeFile('./data/default.json', JSON.stringify(object), function (err) { if (err) { return console.log(err) } })
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}setdefault .${rb}`)
      } else {
        message.channel.send('You dont have permisson to run this command.')
      }
    }
    if (message.content.startsWith(prefix + 'purge')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || config.admins.indexOf(message.author.id) !== -1 || message.member.permissions.has('ADMINISTRATOR')) {
        const user = message.mentions.users.first()
        const amount = parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
        if (!amount) return message.reply('Must specify an amount to delete!')
        if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!')
        message.channel.fetchMessages({
          limit: amount
        }).then((messages) => {
          if (user) {
            const filterBy = user ? user.id : bot.user.id
            messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount)
          }
          message.channel.bulkDelete(messages).catch(error => message.channel.send(error))
        })
        message.channel.send('Seccessfully deleted **' + amount + '** messages!')
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}purge .${rb}`)
      } else {
        message.channel.send('You dont have permisson to run this command.')
      }
    }
    if (message.content.startsWith(prefix + 'skip')) {
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}skip .${rb}`)
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
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}resetwarn .${rb}`)
      } else {
        message.channel.send('You have to be able to kick/ban members to use this command')
      }
    }

    if (message.content.startsWith(prefix + 'pause')) {
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}pause .${rb}`)
    }

    if (message.content.startsWith(prefix + 'leave')) {
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}leave .${rb}`)
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
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}warn .${rb}`)
      } else {
        message.channel.send('You need to have permisson to kick/ban members to use this command!')
      }
    }

    if (message.content.startsWith(prefix + 'say')) {
      if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) !== -1) {
        var say = message.content.split(' ').splice(1).join(' ')
        message.delete()
        message.channel.send(say)
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}say .${rb}`)
      }
    }
    if (message.content.startsWith(prefix + 'serverInfo')) {
      let rb = '`'
      let default_Channel = message.guild.channels.find('name', 'general')
      let embed = new Discord.RichEmbed()

      .setAuthor(`${message.guild.name}'s Infos:`)
      .setColor(getRandomHex())
      .setThumbnail(message.guild.iconURL)
      .addField(`Guild Name:`, `**${message.guild.name}**`)
      .addField(`Guild ID:`, `**${message.guild.id}**`)
      .addField(`Owner:`, `${message.guild.owner}`)
      .addField(`Verification Level:`, `**${message.guild.verificationLevel}**`)
      .addField(`Region:`, `**${message.guild.region}**`)
      .addField(`Large guild?:`, `**${message.guild.large}**`)
      .addField(`Total Users:`, `**${message.guild.memberCount}** Users!!`)
      .addField(`Channels:`, `**${message.guild.channels.size}** Channels!!`)
      .addField(`AFK Channel (if setted):`, `${message.guild.afkChannel}`)
      .addField(`Default Channel:`, `**${default_Channel}** (not going to work if you deleted your default channel)`)
      .addField(`Roles:`, `**${message.guild.roles.size}** Roles!!`)
      .addField(`Created At:`, `**${message.guild.createdAt}**`)

      message.channel.send(embed)
    }
    if (message.content.startsWith(prefix + 'remindme')) {
      let args = message.content.split(' ').slice(1)
      if (!args) message.channel.send('you need to specify what you want to be reminded with.')
      let time1 = args[0]
      if (!time1) message.channel.send('You need to specify time.')
      let args1 = args.slice(1).join(' ')
      message.channel.send('Got it :ok_hand: , gonna remind in **' + time1 + '**')
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}remindme .${rb}`)

      let embed = new Discord.RichEmbed()
      .setColor(getRandomHex())
      .setAuthor(message.author.username)
      .setThumbnail(message.author.displayAvatarURL)
      .addField('Times up, its been **' + time1 + '** thers your reminder:', args1)
      .setFooter('Requested at:', bot.user.displayAvatarURL)
      .setTimestamp()

      setTimeout(function () {
        message.author.send({embed: embed})
      }, ms(time1))
    }

    if (message.content.startsWith(prefix + 'mute')) {
      if (message.author.id === config.owner_id || message.member.permissions.has('ADMINISTRATOR') || config.admins.indexOf(message.author.id) !== -1) {
        let args = message.content.split(' ').slice(1)
        let thetime = args[1]
        if (!thetime) return message.channel.send('ther is no time specified.')
        let member = message.mentions.members.first()
        if (!member) return message.channel.send('You need to mention a user!')
        console.log(member)
        let muteRole = message.guild.roles.find(r => r.name === 'Muted')
        if (!muteRole) {
          try {
            muteRole = message.guild.createRole({
              name: 'Muted',
              color: 'BLACK',
              position: 5,
              permissions: []
            })
          } catch (error) {
            bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(error)
          }
        }
        message.guild.channels.map((channel, id) => {
          channel.overwritePermissions(muteRole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          })
        })
        member.addRole(muteRole)
        bot.users.find('id', message.mentions.members.first().id).send(`You have been mutted for** ${time} ** in ${message.guild.name}.`)
        message.channel.send('muted the user.')
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}mute .${rb}`)

        setTimeout(function () {
          member.removeRole(muteRole)
          bot.users.find('id', message.mentions.members.first().id).send(`You have been unmutted.`)
          message.channel.send('unmuted the user.')
        }, ms(thetime))
      } else {
        message.channel.send('you dont have permisson to run this command.')
      }
    }
    if (message.content.startsWith(prefix + 'unmute')) {
      if (message.author.id === config.owner_id || message.member.permissions.has('ADMINISTRATOR')) {
        let member = message.mentions.members.first()
        if (!member) return message.channel.send('You need to mention a user!')
        const muteRole = message.guild.roles.find(r => r.name === 'Muted')

        member.removeRole(muteRole)
        bot.users.find('id', message.mentions.members.first().id).send(`You have been unmutted in ${message.guild.name}.`)
        message.channel.send(`unmuted the user.`)
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}unmute .${rb}`)
      } else {
        message.channel.send('you dont have permisson to run this command.')
      }
    }
    if (message.content.startsWith(prefix + 'review')) {
      let args = message.content.split(' ').splice(1).join(' ')
      if (!args) return message.channel.send(`you need to specify a txt after **${prefix}review**`)
      const id = bot.guilds.get('283893701023891466')
      if (!id) return message.channel.send('couldnt find the dev server')
      let embed = new Discord.RichEmbed()
      .setAuthor('Feedback')
      .setColor(getRandomHex())
      .addField('Feedback sent by: **' + message.author.username + '**', args)
      .setFooter('Feedback been sent at: ', bot.user.displayAvatarURL)
      .setTimestamp()

      bot.guilds.get('283893701023891466').channels.get('358202949844992004').send({embed: embed})
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}review .${rb}`)
      message.channel.send('FeedBack Successfully sent!')
    }
    if (message.content.startsWith(prefix + 'swearEnable')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id || message.member.permissions.has('ADMINISTRATOR')) {
        var index1 = array1.indexOf(message.guild.id)
        array1.splice(index1, 1)
        message.channel.send('Enabled.')
        array1.push(message.guild.id)
        fs.writeFile('./data/disableS.json', JSON.stringify(array1), function (err) { if (err) { return console.log(err) } })

        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}enableSwear .${rb}`)
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

        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}disable .${rb}`)
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
          bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}eval .${rb}`)
        } catch (err) {
          message.channel.send('```diff\n- ' + err + '```')
        }
      } else {
        message.channel.send('Sorry, you do not have permissisons to use this command, **' + message.author.username + '**.')
      }
    }

    if (message.content.startsWith(prefix + 'volume')) {
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}volume .${rb}`)
    }
    if (message.content.startsWith(prefix + 'kill')) {
      if (message.guild.owner.id === message.author.id || message.author.id === config.owner_id) {
        message.channel.send('i didnt iven want to be here')
        message.guild.leave()
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}kill .${rb}`)
      }
    }

    if (message.content.startsWith(prefix + 'resume')) {
        bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}resume .${rb}`)
    }

    if (message.content.startsWith(prefix + 'invite')) {
      message.channel.send('My OAuth URL: ' + `http://discordapp.com/oauth2/authorize?client_id=${config.client_id}&scope=bot&permissions=8`)
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}invite .${rb}`)
    }

    if (message.content.startsWith(prefix + 'about')) {
      var cdb = '```'
      var msg = (`${cdb}fix
Hello,im Mayumi-San! To see all my commands type ${prefix}help.
${cdb}`)
      message.channel.send(msg)
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}about .${rb}`)
    }
    if (message.content.startsWith(prefix + 'queue')) {
      bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Command Successful --> server: \n${message.guild.name} (id:${message.guild.id}) \nUser:${message.author.username} \n Command: ${prefix}queue .${rb}`)
    }
  } catch (err) {
    bot.guilds.get('283893701023891466').channels.get('358200987527413760').send(`${rb}[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Bot CRASHED!! <---> Error: \n${err} ${rb}`)
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

music(bot, {
	prefix: '$',       // Prefix of '-'.
	global: true,     // Server-specific queues.
	maxQueueSize: 20,  // Maximum queue size of 10.
	clearInvoker: false, // If permissions applicable, allow the bot to delete the messages that invoke it (start with prefix)
    channel: 'Music1'   // Name of voice channel to join. If omitted, will instead join user's voice channel.
});

bot.login(config.token)

process.on('unhandledRejection', err => {
  console.error('Uncaught We had a promise error \n' + err.stack)
})
