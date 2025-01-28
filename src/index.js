// Require the necessary discord.js classes
const { Client, Collection } = require('discord.js');
const fs = require('node:fs');

// Create a new client instance
const client = new Client({
    messageCacheLifetime: 60,
    fetchAllMembers: false,
    messageCacheMaxSize: 10,
    restTimeOffset: 0,
    restWsBridgetimeout: 100,
    shards: "auto",
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: true,
    },
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: 32767
});

module.exports = client;

const config = require('./Data/config.json')
const token = config.token;
// Global Variables
client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.categories = fs.readdirSync("./src/Commands/");

// Initializing the project
//Loading files, with the client variable like Command Handler, Event Handler, ...
["command_handler", "event_handler"].forEach((handler) => {
    require(`./Handlers/${handler}`)(client)
});

client.login(token);
