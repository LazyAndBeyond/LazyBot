const mongoose = require('mongoose')
const guildSchema = mongoose.Schema({
    guildID: String,
    prefix: String,
    welcomeEnabled: Boolean,
    welcomeChannel: String,
    welcomeMessage: String,
    leaveMessage: String,
    modLog: Boolean,
    logChannel: String
})

module.exports = mongoose.model('guilds', guildSchema)