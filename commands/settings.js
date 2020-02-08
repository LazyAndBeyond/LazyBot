module.exports = {
    "name": "settings",
    "dm": false,
    "args": false,
    "usage": "<key> <value> (keys are: prefix, welcomeEnabled, welcomeChannel, welcomeMessage, leaveMessage) / reset to reset all settings to default",
    "aliases": [],
    "permLevel": "Admin",
    "nsfw": false,
    "enabled": true,
    "cooldown": 5,
    "category": "Server-Moderation",
    "description": "Change the guild settings of the bot (use <prefix>help settings for more info)",
    execute(message, args, level) {
        const mongoose = require('mongoose')
        const db = require('../modules/MongoDB.js')
        const util = require('util')
        const bot = message.client
        const key = args[0]
        const value = message.content.split(' ').splice(2).join(' ')

        /*mongoose.connect(`${process.env.MONGO}`, {
            useNewUrlParser: true,
            useFindAndModify: false,
        })*/

        db.find({
            guildID: message.guild.id
        })

        db.findOne({
            guildID: message.guild.id
        }, (err, data) => {
            if (!data) {
                const guild = message.guild
                const guilddb = new db({
                    guildID: guild.id,
                    prefix: 'b$',
                    welcomeEnabled: false,
                    welcomeChannel: 'welcome',
                    welcomeMessage: 'Welcome to {{guild}} {{user}}!',
                    leaveMessage: 'Bye {{user}}',
                    modLog: false,
                    logChannel: 'modlog'
                })
                guilddb.save()
                    .then(() => {
                        db.findOne({
                            guildID: message.guild.id
                        }, (error, result) => {
                            if (result && !key) message.channel.send(`${util.inspect(result)}`, {
                                code: 'coffeescript'
                            }).catch(err1 => console.log(err1))
                        })
                    })
                /*.then(result => message.channel.send(`${util.inspect(result)}`, {
                                       code: 'coffeescript'
                                   })).catch(err => console.log(err))*/
            } else {
                if (!key) return message.channel.send(`${util.inspect(data)}`, {
                    code: 'coffeescript'
                })
            }

            /*if (!key) return message.channel.send(`${util.inspect(data)}`, {
                code: 'coffeescript'
            })*/
            if (!value && !key) return //message.channel.send(`${util.inspect(data)}`, {code: 'coffeescript'})
            //if (!data.key) return message.reply(`${key} doesnt exsist in the db`)
            if (!value && key && key !== 'reset') return message.reply('Please specify a new value')

            switch (key) {

                case 'prefix':
                    db.findOneAndUpdate({
                        guildID: message.guild.id
                    }, {
                        prefix: value
                    }, {
                        new: true
                    }).select('-_id -__v -guildID').then(output => message.channel.send(`${util.inspect(output)}`, {
                        code: 'coffeescript'
                    }))
                    message.reply(`**Prefix** changed to **${value}**`)
                    break

                case 'welcomeChannel':
                    db.findOneAndUpdate({
                        guildID: message.guild.id
                    }, {
                        welcomeChannel: value
                    }, {
                        new: true
                    }).select('-_id -__v -guildID').then(output => message.channel.send(`${util.inspect(output)}`, {
                        code: 'coffeescript'
                    }))
                    message.reply(`**WelcomeChannel** changed to **${value}**`)
                    break

                case 'welcomeEnabled':
                    db.findOneAndUpdate({
                        guildID: message.guild.id
                    }, {
                        welcomeEnabled: value
                    }, {
                        new: true
                    }).select('-_id -__v -guildID').then(output => message.channel.send(`${util.inspect(output)}`, {
                        code: 'coffeescript'
                    }))
                    message.reply(`**WelcomeEnabled** changed to **${value}**`)
                    break

                case 'welcomeMessage':
                    db.findOneAndUpdate({
                        guildID: message.guild.id
                    }, {
                        welcomeMessage: value
                    }, {
                        new: true
                    }).select('-_id -__v -guildID').then(output => message.channel.send(`${util.inspect(output)}`, {
                        code: 'coffeescript'
                    }))
                    message.reply(`**WelcomeMessage** changed to **${value}**`)
                    break

                case 'leaveMessage':
                    db.findOneAndUpdate({
                        guildID: message.guild.id
                    }, {
                        leaveMessage: value
                    }, {
                        new: true
                    }).select('-_id -__v -guildID').then(output => message.channel.send(`${util.inspect(output)}`, {
                        code: 'coffeescript'
                    }))
                    message.reply(`**LeaveMessage** changed to **${value}**`)
                    break

                case 'modLog':
                    db.findOneAndUpdate({
                        guildID: message.guild.id
                    }, {
                        modLog: value
                    }, {
                        new: true
                    }).select('-_id -__v').then(output => message.channel.send(`${util.inspect(output)}`, {
                        code: 'coffeescript'
                    }))
                    break

                case 'logChannel':
                    db.findByIdAndUpdate({
                        guildID: message.guild.id
                    }, {
                        logChannel: value
                    }, {
                        new: true
                    }).select('-_id -__v').then(output => message.channel.send(`${util.inspect(output)}`, {
                        code: 'coffeescript'
                    }))
                    break

                case 'reset':
                    db.findOneAndUpdate({
                        guildID: message.guild.id
                    }, {
                        prefix: 'b$'
                    }, {
                        welcomeChannel: 'welcome'
                    }, {
                        welcomeEnabled: false
                    }, {
                        welcomeMessage: 'Welcome to {{guild}} {{user}}!'
                    }, {
                        leaveMessage: 'Bye {{user}}'
                    }, {
                        new: true
                    }).select('-_id -__v -guildID').then(output => message.channel.send(`${util.inspect(output)}`, {
                        code: 'coffeescript'
                    }))
                    message.reply('Guild settings resetted.')
                    break
            }
            /*data.key = value
            message.reply(key + ' was changed to ' + value)*/
        }).select('-_id -__v -guildID')
    }
}