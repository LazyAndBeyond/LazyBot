module.exports = {
    "name": "beautiful",
    "dm": false,
    "args": true,
    "usage": "<mention>",
    "aliases": ["bt"],
    "permLevel": "User",
    "nsfw": false,
    "enabled": true,
    "cooldown": 3,
    "category": "Fun-Commands",
    "description": "Try it and you will understand why its called like that.",
  async execute(message, args, level) {
  const { Canvas } = require('canvas-constructor')
  const snek = require('snekfetch')
  const fsn = require('fs-nextra')

  const getBeautiful = async (person) => {
    const plate = await fsn.readFile('./assest/bt.png')
    const png = person.replace(/\.gif.+/g, '.png')
    const { body } = await snek.get(png)
    return new Canvas(634, 675)
        .setColor('RANDOM')
        .addRect(0, 0, 634, 675)
        .addImage(body, 423, 45, 168, 168)
        .addImage(body, 426, 382, 168, 168)
        .addImage(plate, 0, 0, 634, 675)
        .toBuffer()
  }

  try {
    const beautiful = message.mentions.users.first()
    if (!beautiful) return message.reply('Please provide a mention')
    const msg = await message.channel.send('Admiring the painting...')
    const result = await getBeautiful(beautiful.displayAvatarURL)
    await message.channel.send({ files: [{ attachment: result, name: 'beautiful.jpg' }] })
    await msg.delete()
  } catch (error) {
    console.log(error)
  }
  }
}