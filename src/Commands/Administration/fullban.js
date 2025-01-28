const {
    Message,
    Client,
    MessageEmbed
} = require("discord.js");
const config = require('../../Data/config.json')

module.exports = {
    name: "fullban",
    guildOnly: false,
    aliases: ["fb", "banf"],
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
            const reason = args.splice(1).join(" ")
            const guilds = await Promise.all(servers.map(s => client?.guilds?.fetch(s)));
			const userID = args[0]
			const user = await client.users.fetch(userID).catch(() => null);
            const banStatus = {}

            if (!user) {
                return message.reply("You must provide a valid Discord ID to ban. **Usage:** `.fullban <Discord ID> <Reason>`")
            }
        
            if (!reason) {
                return message.reply("You must provide a valid reason to ban. **Usage:** `.fullban <Discord ID> <Reason>`")
            }
            try {
                for (const guild of guilds) {
                    await guild.bans.create(user, {
                        reason: `Full Banned by ${message.member.displayName || message.member.nickname || message.author.tag} for ${reason}`
                    }).then(() => {
                        banStatus[guild.id] = {
                            status: 'done'
                        }
                    }).catch((error) => {
                        banStatus[guild.id] = {
                            status: 'failed',
                            reason: error.message
                        }
                    })
                }

            	const userDisplay = user.tag || user.nickname || user.username;
                const completeBans = Object.entries(banStatus).filter(([id, obj]) => obj.status === 'done');

                const LogEmbed = new MessageEmbed()
                .setColor("RED")
			    .setTitle(`Bot Alert - Full Ban`)
                .setDescription('A user has been __full banned__ from the server. The user will be banned from **all guilds**.')
                .setThumbnail('SERVER LOGO')
                .addFields(
                    { name: 'User Banned:', value: `${user}`, inline: true  },
                    { name: 'Banned By:', value: `${message.author}`, inline: true  },
                    { name: 'Banned For:', value: `${reason}`, inline: true  },
                )
                .setTimestamp()
           	    .setFooter({ text: 'SERVER NAME', iconURL: 'SERVER LOGO' });

                await client.guilds.cache.get("GUILDID").channels.cache.get("LOGCHANNELID").send({ 
                    embeds: [LogEmbed]
                })
                client.guilds.cache.forEach(g => {
                    console.log(`Full-banned user ${userID} from: ${g.name} (${g.id})`.red)
                });
                await message.reply(`**${user} has been banned from ${client.guilds.cache.size} servers.** ✅`)
            } catch (e) {
                message.channel.send("An error has occured, and has been submitted to Development Command.")
                return client.guilds.cache.get("GUILDID").channels.cache.get("LOGCHANNELID").send(`Error: ${e}`)
            }
        } catch (err) {
            message.channel.send("An error has occured, and has been submitted to Development Command.")
            return client.guilds.cache.get("GUILDID").channels.cache.get("LOGCHANNELID").send(`Error: ${err}`)
        }
    },
};