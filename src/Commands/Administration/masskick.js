const {
    Message,
    Client,
    MessageEmbed
} = require("discord.js");
const config = require('../../Data/config.json')

module.exports = {
    name: "masskick",
    guildOnly: false,
    aliases: ["mk", "kick"],
    rolePerms: ["ROLEID", "ROLEID"],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        try {
            const userID = args[0]
		    const user = await client.users.fetch(userID).catch(() => null);
            const reason = args.splice(1).join(" ")
            const guilds = await Promise.all(client.guilds.cache.map(async guild => [guild.id, await guild.members.fetch(user).catch(() => null)])).then(guilds => guilds.filter(g => g[1]).map(guild => client.guilds.resolve(guild[0])))
            const kickStatus = {}

            if (!user) {
                return message.reply("You must provide a valid Discord ID to kick. **Usage:** `.masskick <Discord ID> <Reason>`")
            }

            if (!reason) {
                return message.reply("You must provide a valid Discord ID to kick. **Usage:** `.masskick <Discord ID> <Reason>`")
            }

            for (const guild of guilds) {
                if (guild.id === "FANSERVER-ID") {
                    continue;
                }
                const member = await guild.members.fetch(user);
                await member.kick(member, {
                    reason: `Mass-kicked by ${message.member.displayName || message.member.nickname || message.author.tag} for ${reason}`
                }).then(() => {
                    kickStatus[guild.id] = {
                        status: 'done'
                    }
                }).catch((error) => {
                    kickStatus[guild.id] = {
                        status: 'failed',
                        reason: error.message
                    }
                })
            }

            const userDisplay = user.tag || user.nickname || user.username;
            const completeKicks = Object.entries(kickStatus).filter(([id, obj]) => obj.status === 'done');

            const LogEmbed = new MessageEmbed()
                .setColor("RED")
			    .setTitle(`Bot Alert - Mass Kick`)
                .setDescription('A user has been __mass kicked__ from the Discords. This is usually done in cases of proper resignation or other staff reasons.')
                .setThumbnail('SERVERLOGO')
                .addFields(
                    { name: 'User Kicked:', value: `${user}`, inline: true  },
                    { name: 'Kicked By:', value: `${message.author}`, inline: true  },
                    { name: 'Kicked For:', value: `${reason}`, inline: true  },
                )
                .setTimestamp()
           	    .setFooter({ text: 'SERVERNAME', iconURL: 'SERVERLOGO' });

            await client.guilds.cache.get("GUILDID").channels.cache.get("LOGCHANNELID").send({ 
                embeds: [LogEmbed]
            })
            client.guilds.cache.forEach(g => {
                console.log(`Mass-kicked user ${userID} from: ${g.name} (${g.id})`.red)
            });
            await message.reply(`**${user} has been kicked from ${client.guilds.cache.size - 1} servers excluding the fan server.** ✅`)
        } catch (e) {
            message.channel.send("An error has occured, and has been submitted to Development Command.")
            return client.guilds.cache.get("GUILDID").channels.cache.get("LOGCHANNELID").send(`Error: ${e}`)
        }
    },
};