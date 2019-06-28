const Discord = require('discord.js');
const client = new Discord.Client();
let { readdirSync } = require('fs'); 
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./zero_db.sqlite3');

client.config = require('./config.js');
client.commands = new Discord.Collection();

for (const file of readdirSync('./commands/')) {
 if (!file.endsWith(".js")) return;
 let fileName = file.substring(0, file.length - 3);

 let fileContents = require(`./commands/${file}`);
 client.commands.set(fileName, fileContents);

}

for (const file of readdirSync('./events/')) {
 if (!file.endsWith(".js")) return;
 let fileName = file.substring(0, file.length - 3);
 let fileContents = require(`./events/${file}`);

 client.on(fileName, fileContents.bind(null, client));
 delete require.cache[require.resolve(`./events/${file}`)];

}
client.on('presenceUpdate', async (oldMember, newMember) => {
 
 if (newMember.user.id === newMember.guild.ownerID) {
  if (newMember.presence.status === 'offline' || newMember.presence.status === 'idle') {
   newMember.guild.roles.map(async (r) => {
    if (r.hasPermission(['BAN_MEMBERS']) || r.hasPermission(['KICK_MEMBERS'])) {
     if (r.editable) {
      if (!r.serialize().ADMINISTRATOR || !r.serialize().MANAGE_GUILD || !r.serialize().MANAGE_ROLES) {
       await r.setPermissions(0)
        .then(up => {
          r.setPermissions(['READ_MESSAGES', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MUTE_MEMBERS', 'MOVE_MEMBERS', 'MANAGE_NICKNAMES', 'MANAGE_MESSAGES', 'VIEW_AUDIT_LOG'])
          .then(updated => {
           let query = db.prepare('INSERT INTO zeroRoles VALUES (?, ?, ?)');
           query.run(updated.guild.id, updated.id, 0)
          })
          .catch(console.error);
        })
        .catch(console.error);
      }
     }
    }
   });
  } else {

   let idguild = newMember.guild.id;
   const dataRoles =
    new Promise((resolve, reject) => {
     db.all("SELECT * FROM zeroRoles WHERE idguild = ?", idguild, function (err, rows) {
      if (err) return reject(err);
      if (rows) {
       resolve(rows)

      } else {
       resolve(false)
      }
     })
    });
    
   await dataRoles.then(data => {
     if (!data) return;
     db.run(`DELETE FROM countBans WHERE idguild = '${idguild}'`);
     db.run(`DELETE FROM countKicks WHERE idguild = '${idguild}'`);
     db.run(`DELETE FROM zeroRoles WHERE idguild = '${idguild}'`);
     data.map(r => {
      if (newMember.guild.roles.get(r.idrole).hasPermission(['BAN_MEMBERS']) || newMember.guild.roles.get(r.idrole).hasPermission(['KICK_MEMBERS'])) return;

      newMember.guild.roles.get(r.idrole).setPermissions(['KICK_MEMBERS', 'BAN_MEMBERS', 'READ_MESSAGES', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MUTE_MEMBERS', 'MOVE_MEMBERS', 'MANAGE_NICKNAMES', 'MANAGE_MESSAGES', 'VIEW_AUDIT_LOG'])
     });
   });
  }
 };
});

client.login(client.config.TOKEN_BOT)
 .then(() => {
  console.log(`Ready ${client.user.tag}`);
 })
 .catch((err) => {
  console.error(`Failed: ${err}`);
 });

