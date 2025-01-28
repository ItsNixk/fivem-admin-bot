const { Client } = require('discord.js');
const fs = require('fs');

/**
   *
   * @param {Client} client
   */

module.exports = (client) => {
    try {
        fs.readdirSync("./src/Events/").forEach((file) => {
            const events = fs.readdirSync("./src/Events/").filter((file) =>
              file.endsWith(".js")
            );
            for (let file of events) {
              let pull = require(`../Events/${file}`);
              if (pull.name) {
                client.events.set(pull.name, pull);
              }
            }
            console.log((`${file} has been loaded.`));
          });
    } catch (e) {
        console.log(e.message);
    }
}
