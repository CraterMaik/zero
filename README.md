# Zero
> _Motto of zero:_ Make the owner of a server live better while not in the discord app.

Zero a discord bot to control the permissions and actions(kick and ban) of the staff of a discord server when the owner of the server is disconnected(offline) or absent(idle).

# System

The system automatically **ACTIVATES** when the server owner is disconnected
or absent, and **DEACTIVATES** when the server owner reconnects.

### _If the zero system is **ACTIVATED**_:
 1. #### Commands: 
    The commands have a limit of use when the system is activated.

 2. #### Roles(permissions):
    All roles with ban and/or kick permissions will be disabled and forcing 
    commands to be used for actions(kick and ban).

### _If the zero system is **DISABLED**_:
 1. #### Commands: 
    The commands do not have a usage limit when the system is deactivated.

 2. #### Roles(permissions):
    All roles with kick and/or ban permissions will be activated again 
    and they can also use commands for actions(kick and ban).


# Commands
- ban [@user] [reason]     :: Banned a member of the server.
- kick [@user] [reason]     :: Kick a member of the server.
- unban [iduser] [reason]   :: Unbanned a member of the server.
- zeroff  :: Deactivates the zero system. (Requires administrator permissions)

# Installation
1. It requires a discord application, go to [Discord app](https://discordapp.com/developers/applications/) and create a bot application and get the token.

2. Create an application on [Glitch.com](https://glitch.com/) or locally on your PC, installing [NodeJS](https://nodejs.org/en/)

> Is developing using the [discord.js](https://discord.js.org/#/docs/main/stable/general/welcome) and [sqlite3](https://www.npmjs.com/package/sqlite3) module.

3. Configure the `config.js` file
entering the token of your bot.
 ```js
 let config = {
  TOKEN_BOT: "HERE-TOKEN",
  PREFIX_BOT: "z!", 
  UNLIMITED_BANS: 3,
  UNLIMITED_KICKS: 10

 }

 module.exports = config;
 ```
4. Open console or command terminal and type `npm install`.

5. Write `node index.js` in the console to activate the bot.

6. All controls and system actions are automatic according to the status of the server owner.

# Objective
Prevent mismanagement and abuse of banned and kicked permissions by members (Mods) of a server when the server owner is absent or disconnected and can not control all these following cases in bulk, damaging a server/community:

- Case 1:

![case1](https://i.imgur.com/tqSmzOa.png)

- Case 2:

![case2](https://i.imgur.com/d9C7S3Q.png)


# ZERO SYSTEM a bot created for the event of Discord Hack-Week
![DHW](https://i.imgur.com/mjFi6Br.png)

# Contact

> Discord TAG: **CraterMaik#1475**

> Twitter: **CraterMaik**

> Web: **https://portalmybot.com/**
