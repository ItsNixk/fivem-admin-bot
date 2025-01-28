const client = require("..");
var config = require("../Data/config.json");
const {
    MessageEmbed
} = require("discord.js");

client.on('messageCreate', async message => {
    let prefix = config.prefix
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();
    if(!message.content.startsWith(".")) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd.toLowerCase()) || client.commands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
    if (!command) return;
    if (command) {

        if (command.guildOnly === true) {
            if (message.guild.id !== "MAINGUILDID") {
                return message.reply("This command can only be executed in the Main Discord.")
            }
        }

        if (command.rolePerms.length >= 1) {
            if (!(command.rolePerms).some((id) => client.guilds.cache.get("MAINGUILDID").members.cache.get(message.author.id).roles.cache.has(id))) {
                return message.reply("This command has a higher permission level than your roles allow.")
            }
        }

        command.run(client, message, args, prefix)
    }
})
