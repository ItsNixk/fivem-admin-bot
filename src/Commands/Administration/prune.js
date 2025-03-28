const {
    Message,
    Client,
    MessageEmbed
} = require("discord.js");
const config = require('../../Data/config.json')

module.exports = {
    name: "prune",
    aliases: ["purge", "p"],
    rolePerms: ["ROLEID", "ROLEID"],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        let int = args[0]
        if (!int) {
            return message.reply("You must provide a valid messages to prune. **Usage:** `.prune <Amount>`")
        }

        if (int > 100) int = 100;

        try {
            const fetch = await message.channel.messages.fetch({
                limit: int
            });
            const deletedMessages = await message.channel.bulkDelete(fetch, true);

            const results = {};
            for (const [, deleted] of deletedMessages) {
                const user = `${deleted.author.username}#${deleted.author.discriminator}`;
                if (!results[user]) results[user] = 0;
                results[user]++;
            }

            const userMessageMap = Object.entries(results);

            await message.channel.send(`I have pruned ${deletedMessages.size} message${deletedMessages.size > 1 ? 's' : ''}. ✅`)

            console.log(`Pruned ${deletedMessages.size} messages from channel #${message.channel.name} (${message.channel.id}) in guild ${message.guild} (${message.guild.id}).`.red)

            const LogEmbed = new MessageEmbed()
                .setColor("BLUE")
		.setTitle(`Bot Alert - Message Prune`)
                .setDescription('An admin has pruned messages from a channel. Reference the below logging.')
                .setThumbnail('SERVERLOGO')
                .addFields(
                    { name: 'Messages Pruned:', value: `${deletedMessages.size}`, inline: true  },
                    { name: 'Channel & Guild:', value: `${message.channel}, ${message.guild}`, inline: true   },
                    { name: 'Pruned By:', value: `${message.author}`, inline: true   },
                )
                .setTimestamp()
           	.setFooter({ text: 'SERVERNAME', iconURL: 'SERVERLOGO' });

            await client.guilds.cache.get("GUILDID").channels.cache.get("LOGCHANNELID").send({ 
                embeds: [LogEmbed]
            })
        } catch (e) {
            message.channel.send("An error has occured, and has been submitted to Development Command.")
            return client.guilds.cache.get("GUILDID").channels.cache.get("LOGCHANNELID").send(`Error: ${e}`)
        }
    }
};
