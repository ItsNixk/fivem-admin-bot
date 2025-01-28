const { Client } = require('discord.js');
const fs = require('fs');

/**
*
* @param {Client} client
*
*/

module.exports = (client) => {
    try {
        let command = 0;
        fs.readdirSync("./src/Commands").forEach(cmd => {
        
            let commands = fs.readdirSync(`./src/Commands/${cmd}/`).filter((file) => file.endsWith(".js"));
            for (cmds of commands) {
                let pull = require(`../Commands/${cmd}/${cmds}`);
                if (pull.name) {
                    client.commands.set(pull.name, pull);
                    command++
                } else {
                    console.log(`The command ${cmds} is missing a required "data" or "execute" property.`);
                    continue;
                }
                if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));

            }
        })
        console.log(`Registered ${command} commands`);
    } catch (e) {
        console.log(e);
    }
}