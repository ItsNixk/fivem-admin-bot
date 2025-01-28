const {
    Message,
    Client,
    MessageEmbed
} = require("discord.js");
const config = require('../../Data/config.json')

module.exports = {
    name: "massunban",
    guildOnly: false,
    aliases: ["ub", "unban"],
    rolePerms: ["ROLEID", "ROLEID"],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        try {
            const servers = config.all
            const guilds = await Promise.all(servers.map(s => client?.guilds?.fetch(s)));
            const userID = args[0]
		    const user = await client.users.fetch(userID).catch(() => null);
            const unbanStatus = {}

            if (!user) {
                return message.reply("You must provide a valid Discord ID to unban. **Usage:** `.massunban <Discord ID>`")
            }

            for (const guildcheck of guilds) {
                await guildcheck.bans.fetch({
                    user
                }).then(async () => {
                    await guildcheck.members.unban(userID, `Mass-unbanned by ${message.author.tag}`
                    )
                    unbanStatus[guildcheck.id] = {
                        status: 'done',
                    }
                }).catch(async (error) => {
                    unbanStatus[guildcheck.id] = {
                        status: 'failed',
                        reason: error.message
                    }
                })
            }

            const userDisplay = user.tag || user.nickname || user.username;
            const completeUnbans = Object.entries(unbanStatus).filter(([id, obj]) => obj.status === 'done');

            const LogEmbed = new MessageEmbed()
                .setColor("GREEN")
			    .setTitle(`Bot Alert - Mass Unban`)
                .setDescription('A user has been __mass unbanned__ from the server. The user will be able to join **all guilds** again.')
                .setThumbnail('SERVERLOGO')
                .addFields(
                    { name: 'User Unbanned:', value: `${user}`, inline: true  },
                    { name: 'Unbanned By:', value: `${message.author}`, inline: true  },
                )
                .setTimestamp()
           	    .setFooter({ text: 'SERVERNAME', iconURL: 'SERVERLOGO' });

            await client.guilds.cache.get("GUILDID").channels.cache.get("LOGCHANNELID").send({ 
                embeds: [LogEmbed]
            })
            client.guilds.cache.forEach(g => {
                console.log(`Mass-unbanned user ${userID} from: ${g.name} (${g.id})`.red)
            });
            await message.reply(`**${user} has been unbanned from ${client.guilds.cache.size} servers.** ✅`)
        } catch (e) {
            message.channel.send("An error has occured, and has been submitted to Development Command.")
            return client.guilds.cache.get("GUILDID").channels.cache.get("LOGCHANNELID").send(`Error: ${e}`)
        }
    },
};