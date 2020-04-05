module.exports = (Bot, guild) => {
  const time = new Date()
  Bot.channels.get('358200987527413760').send(`[ ${time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()} ] <---> Joined: "${guild.name}" (id: "${guild.id}"). \nWith: "${guild.memberCount}" members!`, {code: 'asciidoc'})
  
  const botper = guild.me.hasPermission('MANAGE_ROLES')
  if (!botper) return

  

  
  //discord bot list poster
setInterval(() => {
const snekfetch = require('snekfetch');
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1ODE5ODkxNjUzOTQ4MjExMiIsImJvdCI6dHJ1ZSwiaWF0IjoxNTM0NTQ0NTEyfQ.02o-P_EUBLI1ApiwHQmqVpngMo4eRwghCoLbKZTt7WU';

snekfetch.post(`https://discordbots.org/api/bots/${Bot.user.id}/stats`)
    .set('Authorization', key)
    .send({ server_count: Bot.guilds.size })
    .catch((e) => console.error(e));
}, 1800000);
  
  
  
  
}