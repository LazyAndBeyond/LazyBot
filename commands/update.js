module.exports = {
    "name": "update",
    "dm": false,
    "args": true,
    "usage": "<key> <value>",
    "aliases": [],
    "permLevel": "Bot Owner",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Owner / Admins",
    "description": "a tool to add new objects to the guilds database",

    async execute(message, args, level) {
        const mongoose = require('mongoose')
        const db = require('../modules/MongoDB.js')
        const key = args[0]
        const value = message.content.split(' ').splice(2).join(' ')
        const res = await db.updateMany({}, {
            $set: {
                "logChannel": 'modLog'
            }
        })
        message.reply(`**${res.nModified}** documents has been modified`)
    }
}