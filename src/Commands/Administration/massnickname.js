const {
    Message,
    Client,
    MessageEmbed
} = require("discord.js");
const config = require('../../Data/config.json')

module.exports = {
    name: "massnickname",
    aliases: ["massnick", "mnick", "mn"],
    rolePerms: ["ROLEID", "ROLEID"],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const user = message.mentions.members.first()
        const nickname = args.splice(1).join(" ")

        if (!user) {
            return message.reply("You must provide a valid user to nickname. **Usage:** `.massnickname <@User> <Nickname>`")
        }

        const guilds = await Promise.all(client.guilds.cache.map(async guild => [guild.id, await guild.members.fetch(user.id).catch(() => null)])).then(guilds => guilds.filter(g => g[1]).map(guild => client.guilds.resolve(guild[0])))
        const nickStatus = {}

        if (!nickname) {
            return message.reply("You must provide a valid nickname. **Usage:** `.massnickname <@User> <Nickname>`")
        }

        try {

            for (const guild of guilds) {
                const member = await guild.members.fetch(user);
                await member.setNickname(nickname, `Mass-nicknamed by ${message.author.tag}`
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

            const userDisplay = user
            const completeNick = Object.entries(nickStatus).filter(([id, obj]) => obj.status === 'done');

            console.log(`Mass nicknamed user ${user.id} in all guilds. New Nickname: ${nickname}.`.blue)

            const LogEmbed = new MessageEmbed()
                .setColor("BLUE")
			    .setTitle(`Bot Alert - Mass Nickname`)
                .setDescription('A users nickname has been updated by a staff member within all the Discord servers.')
                .setThumbnail('SERVERLOGO')
                .addFields(
                    { name: 'User Nicknamed:', value: `${user}`, inline: true  },
                    { name: 'Nicknamed By:', value: `${message.author}`, inline: true  },
                    { name: 'New Nickname:', value: `${nickname}`, inline: true  },
                )
                .setTimestamp()
           	    .setFooter({ text: 'SERVERNAME', iconURL: 'SERVERLOGO' });

            await client.guilds.cache.get("GUILDID").channels.cache.get("LOGCHANNELID").send({ 
                embeds: [LogEmbed]
            })
            await message.reply(`I have nicknamed ${user} to \`${nickname}\` in all guilds. ✅`)
        } catch (e) {
            message.channel.send("An error has occured, and has been submitted to Development Command.")
            return client.guilds.cache.get("GUILDID").channels.cache.get("LOGCHANNELID").send(`Error: ${e}`)
        }
    },
};
