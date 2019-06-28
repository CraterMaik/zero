const config = require('../config');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./zero_db.sqlite3');

module.exports = async (client, message, args, send) => {
 let idguild = message.guild.id;
 if (!message.channel.guild) return send.channel('This command only for servers.');

 let reason = args.slice(1).join(" ");
 let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));


 if (member) {
  if (!reason) return send.channel(`You must provide a reason for the ban, __**Example:** ${config.PREFIX_BOT}ban @user#1004 <reason>__`);
  if (!message.guild.members.get(client.user.id).hasPermission(['BAN_MEMBERS'])) return send.channel('I do not have permission to ban.');
  if (!member.bannable) return send.channel('This member is not baneable.');
  if (message.guild.members.get(message.author.id).highestRole.position < member.highestRole.position) return send.channel('This member is not baneable.');
  let status = message.guild.members.get(message.guild.ownerID).presence.status
  if (status) {
   if (status === 'offline' || status === 'idle') {
    if (message.member.hasPermission('ADMINISTRATOR')) {
     member.ban({
      reason: reason,
      days: 1

     }).then(() => {
      send.channel('```py\nSUCCESSFULLY BANNED\n🚷 USER BANNED: ' + member.user.tag.toUpperCase() + ' (' + member.user.id + ')' + '\n📋 REASON: ' + reason + '\n👤 BY: ' + message.author.tag.toUpperCase() + '\n```');
      send.user(member.id, 'You were banned from the _**' + message.guild.name.toUpperCase() + '**_ server.')
     }).catch(err => {
      send.channel('I was unable to ban the member.');
      console.error(err);

     });
    } else {
     const dataRoles =
      new Promise((resolve, reject) => {
       db.all("SELECT * FROM zeroRoles WHERE idguild = ?", idguild, function (err, rows) {
        if (err) return reject(err);
        if (rows) {
         let list = rows.map(r => {
          return r.idrole
         })
         resolve(list)
        } else {
         resolve(false)
        }
       })
      })

     let role = await dataRoles.then(data => {
      return data;
     })

     let memberRole = message.member.roles.map(r => {
      return r.id
     })

     if (!role) return;
     let perms = memberRole.some(mr => {
      return role.find(r => r === mr)
     })

     if (!perms) return send.channel('You do not have sufficient permissions.');
     const dataCount =
      new Promise((resolve, reject) => {
       db.get('SELECT * FROM countBans WHERE idguild = ?', idguild, async (err, rows) => {
        if (err) return reject(err);
        if (rows) {
         resolve(rows.count)

        } else {
         let query = db.prepare('INSERT INTO countBans VALUES (?, ?, ?)');
         query.run(idguild, 1, 0)
         resolve(1)
        }
       })
      })
     let count = await dataCount.then(data => {
      return data;
     })
     if (count > config.UNLIMITED_BANS) {
      send.channel(`You can not ban more than ${config.UNLIMITED_BANS} members of a server when Zero mode is enabled, wait for the server owner to connect or contact a server administrator.`)
      send.user(member.id, 'You were banned from the _**' + message.guild.name.toUpperCase() + '**_ server.')
      db.run(`UPDATE countBans SET status = 1 WHERE idguild = '${idguild}'`);

     } else {
      member.ban({
       reason: reason,
       days: 1

      }).then(() => {
       send.channel('```py\nSUCCESSFULLY BANNED\n🚷 USER BANNED: ' + member.user.tag.toUpperCase() + ' (' + member.user.id + ')' + '\n📋 REASON: ' + reason + '\n👤 BY: ' + message.author.tag.toUpperCase() + '\n```');
       db.run(`UPDATE countBans SET count = ${count + 1} WHERE idguild = '${idguild}'`);

      }).catch(err => {
       send.channel('I was unable to ban the member.');
       console.error(err);

      });
     }
    }

   } else {
    let hasperms = message.member.hasPermission(['BAN_MEMBERS']);
    if (!hasperms) return send.channel('You do not have sufficient permissions.');
    member.ban({
     reason: reason,
     days: 1

    }).then(() => {
     send.channel('```py\nSUCCESSFULLY BANNED\n🚷 USER BANNED: ' + member.user.tag.toUpperCase() + ' (' + member.user.id + ')' + '\n📋 REASON: ' + reason + '\n👤 BY: ' + message.author.tag.toUpperCase() + '\n```');
     send.user(member.id, 'You were banned from the _**' + message.guild.name.toUpperCase() + '**_ server.')
    }).catch(err => {
     send.channel('I was unable to ban the member.');
     console.error(err);

    });
   }
  }

 } else {
  send.channel(`You must mention a member, __**Example:** ${config.PREFIX_BOT}ban @user#1004 <reason>__`);

 }
}