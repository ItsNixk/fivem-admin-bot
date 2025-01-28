const {
    Message,
    Client,
    MessageEmbed
} = require("discord.js");
const config = require('../../Data/config.json')

module.exports = {
    name: "nickname",
    aliases: ["nick"],
    rolePerms: [],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const user = message.member;
        const nickname = args.splice(0).join(" ")
        const guilds = await Promise.all(client.guilds.cache.map(async guild => [guild.id, await guild.members.fetch(user.id).catch(() => null)])).then(guilds => guilds.filter(g => g[1]).map(guild => client.guilds.resolve(guild[0])))
        const nickStatus = {}

        if (!nickname) {
            return message.reply("You must provide a valid nickname. **Usage:** `.nickname <Nickname>`")
        }

        try {
            for (const guild of guilds) {
                const member = await guild.members.fetch(user);
                await member.setNickname(nickname, `Self Nicknamed`
                ).then(() => {
                    nickStatus[guild.id] = {
                        status: 'done'
                    }
                }).catch((error) => {
                    nickStatus[guild.id] = {
                        status: 'failed',
                        reason: error.message
                    }
                })
            }

            const completeNick = Object.entries(nickStatus).filter(([id, obj]) => obj.status === 'done');

            console.log(`Self nicknamed user ${user.id} in all guilds. New Nickname: ${nickname}.`.blue)

            const LogEmbed = new MessageEmbed()
                .setColor("BLUE")
			    .setTitle(`Bot Alert - Self Nickname`)
                .setDescription('A users nickname has been updated within all AHRP Discord servers.')
                .setThumbnail('SERVERLOGO')
                .addFields(
                    { name: 'User Nicknamed:', value: `${user}`, inline: true  },
                    { name: 'New Nickname:', value: `${nickname}`, inline: true  },
                )
                .setTimestamp()
           	    .setFooter({ text: 'SERVERNAME', iconURL: 'SERVERLOGO' });

            await client.guilds.cache.get("GUILDID").channels.cache.get("LOGCHANNELID").send({ 
                embeds: [LogEmbed]
            })
            await message.reply(`I have updated ${user}'s nickname to ${nickname} in all guilds. ✅`)
        } catch (e) {
            message.channel.send("An error has occured, and has been submitted to Development Command.")
            return client.guilds.cache.get("GUILDID").channels.cache.get("LOGCHANNELID").send(`Error: ${e}`)
        }
    },
};