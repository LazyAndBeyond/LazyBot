module.exports = {
    "name": "mylevel",
    "dm": false,
    "args": false,
    "usage": "",
    "aliases": [],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 2,
    "category": "Costum-Commands",
    "description": "Display your permission level.",
  execute(message, args, level) {
  const friendly = message.client.settings.permLevels.find(l => l.level === level).name
  message.reply(`Your permission level is: **${level}** - **${friendly}**`)
  }
}