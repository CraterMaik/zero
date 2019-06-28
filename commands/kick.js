const config = require('../config');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./zero_db.sqlite3');

module.exports = async (client, message, args, send) => {
 let idguild = message.guild.id;
 if (!message.channel.guild) return send.channel('This command only for servers.');

 let reason = args.slice(1).join(" ");
 let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

 if (member) {
  if (!reason) return send.channel(`You must provide a reason for the kick, __**Example:** ${config.PREFIX_BOT}kick @user#1004 <reason>__`);
  if (!message.guild.members.get(client.user.id).hasPermission(['KICK_MEMBERS'])) return send.channel('I do not have permission to kick.')
  if (!member.kickable) return send.channel('This member is not baneable.');
  if (message.guild.members.get(message.author.id).highestRole.position < member.highestRole.position) return send.channel('This member is not kickable.');

  let status = message.guild.members.get(message.guild.ownerID).presence.status
  if (status) {
   if (status === 'offline' || status === 'idle') {
    if (message.member.hasPermission('ADMINISTRATOR')) {
     member.kick(reason).then(() => {
      send.channel('```py\nSUCCESSFULLY KICKED\n🚷 USER KICK: ' + member.user.tag.toUpperCase() + ' (' + member.user.id + ')' + '\n📋 REASON: ' + reason + '\n👤 BY: ' + message.author.tag.toUpperCase() + '\n```');
      send.user(member.id, 'You were kicked from the _**' + message.guild.name.toUpperCase() + '**_ server.')
     }).catch(err => {
      send.channel('I was unable to kick the member.');
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
       db.get('SELECT * FROM countKicks WHERE idguild = ?', idguild, async (err, rows) => {
        if (err) return reject(err);
        if (rows) {
         resolve(rows.count)

        } else {
         let query = db.prepare('INSERT INTO countKicks VALUES (?, ?, ?)');
         query.run(idguild, 1, 0)
         resolve(1)
        }
       })
      })
     let count = await dataCount.then(data => {
      return data;
     })
     if (count > config.UNLIMITED_KICKS) {
      send.channel(`You can not ban more than ${config.UNLIMITED_KICKS} members of a server when Zero mode is enabled, wait for the server owner to connect or contact a server administrator.`)
      db.run(`UPDATE countKicks SET status = 1 WHERE idguild = '${idguild}'`);

     } else {
      member.kick(reason).then(() => {
       send.channel('```py\nSUCCESSFULLY KICK\n🚷 USER KICKED: ' + member.user.tag.toUpperCase() + ' (' + member.user.id + ')' + '\n📋 REASON: ' + reason + '\n👤 BY: ' + message.author.tag.toUpperCase() + '\n```');
       send.user(member.id, 'You were kicked from the _**' + message.guild.name.toUpperCase() + '**_ server.')
       db.run(`UPDATE countKicks SET count = ${count + 1} WHERE idguild = '${idguild}'`);

      }).catch(err => {
       send.channel('I was unable to kick the member.');
       console.error(err);

      });
     }
    }

   } else {
    let hasperms = message.member.hasPermission(['KICK_MEMBERS']);
    if (!hasperms) return send.channel('You do not have sufficient permissions.');

    member.kick(reason).then(() => {
     send.channel('```py\nSUCCESSFULLY KICK\n🚷 USER KICKED: ' + member.user.tag.toUpperCase() + ' (' + member.user.id + ')' + '\n📋 REASON: ' + reason + '\n👤 BY: ' + message.author.tag.toUpperCase() + '\n```');
     send.user(member.id, 'You were kicked from the _**' + message.guild.name.toUpperCase() + '**_ server.');

    }).catch(err => {
     send.channel('I was unable to kick the member.');
     console.error(err);

    });
   }
  }
 } else {
  send.channel(`You must mention a member, __**Example:** ${config.PREFIX_BOT}kick @user#1004 <reason>__`);

 }
 
}