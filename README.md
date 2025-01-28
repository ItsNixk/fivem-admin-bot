# FiveM Admin Bot
This bot was originally made back in 2021 by myself and has been worked on ever since. I decided to publicly release this for those whitelisted communities who wish to increase community security!

This is an older version, therefore it uses prefixed commands, not slash commands. I dont plan on maintaining this specific repo however if you encounter any issues upon setup, feel free to create an Issue.

Due to it being older, the code is definitely not the best, and you will have to search through the files to find config options that were never moved to the config file itself, however it gets the job done.

---

## Commands:

**.fullban**: Bans a member from every Discord the bot is in

**.massban**: Bans a member from every Discord the bot is in EXCLUDING the "Fan" Discord or whatever you set it to

**.masskick**: Kicks a member from all Discords

**.massnickname**: For Staff to change someones nickname across all servers (For promotions, etc)

**.massunban**: Unbans someone from all Discords

**.nickname**: For a member to change their own nickname across all servers

**.prune**: Clear a certain amount of messages from a channel

--- 

## Config Setup:

This will be the `Data/config.json` file, and how to set it up properly.

```json
{
    "all": ["LIST ALL", "GUILD ID's", "HERE"],
    "token": "BOT TOKEN GOES HERE",
    "prefix": ".",
    "copyright": "SERVER NAME",
    "ownerid": "OWNER's DISCORD ID",
    "serverid": "MAIN DISCORD SERVER ID",
    "mst": 5000, // DO NOT TOUCH THIS
    "server": "", // DO NOT TOUCH THIS
    "mongooseConnectionString": "" // Generate a MongoDB connection string
}
```
