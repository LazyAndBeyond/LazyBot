const Discord = require("discord.js");
const fs = require("fs");
const http = require("http");
const express = require("express");
const app = express();
const options = {
  disableEveryone: true,
  fetchAllMembers: true,
  shardCount: 0 //Since the bot isnt on 2k+ servers, We do not shard.
};

//DBL vote tracker

//glitch ping code
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 300000);

var Client = new Discord.Client(options);
var DBManager = require("./DBManager/DBManager.js");

Client.config = require("./data/config.json");
Client.functions = require("./modules/functions.js");
Client.databases = {};
Client.databases.guilds = new DBManager.db({
  name: "guilds"
}); //Create a database for each guild
Client.commands = new Discord.Collection();
Client.cooldowns = new Discord.Collection();
Client.spam = new Discord.Collection();
Client.settings = require("./tools/settings.js");

Client.login(process.env.SECRET).catch(console.error); //Log into the client

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    Client.on(eventName, event.bind(null, Client));
  });
});

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    Client.commands.set(props.name, props);
  });
});

Client.levelCache = {};
for (let i = 0; i < Client.settings.permLevels.length; i++) {
  const thisLevel = Client.settings.permLevels[i];
  Client.levelCache[thisLevel.name] = thisLevel.level;
}

setInterval(function() {
  const activities_list = [
    "the developers console",
    "you and the crew",
    "JavaScript errors",
    "some dank codes",
    "guild leaves...",
    "over you",
    "USERS!",
    "Senpai's!",
    "Tetsuya!"
  ];

  const statues =
    activities_list[Math.round(Math.random() * (activities_list.length - 1))];

  var presence = {
    //Setting the presence
    game: {
      name: `${statues} | ${Client.config.prefix}help`,
      type: 3
    }
  };

  Client.user.setPresence(presence);

  //Saving the database

  var db = Client.databases.guilds;
  db.write(db.data);
}, 60000);
