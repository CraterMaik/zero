const config = require('../config');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./zero_db.sqlite3');

module.exports = async (client, message, args, send) => {
 let idguild = message.guild.id;
 if (!message.channel.guild) return send.channel('This command only for servers.');

  let status = message.guild.members.get(message.guild.ownerID).presence.status
  if (status) {
   if (status === 'offline' || status === 'idle') {
    if (message.member.hasPermission('ADMINISTRATOR')) {
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
        message.guild.roles.get(r.idrole).setPermissions(['KICK_MEMBERS', 'BAN_MEMBERS', 'READ_MESSAGES', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MUTE_MEMBERS', 'MOVE_MEMBERS', 'MANAGE_NICKNAMES', 'MANAGE_MESSAGES', 'VIEW_AUDIT_LOG'])
       });
       
       send.channel('The zero system has been deactivated correctly.');
       message.guild.members.get(message.guild.ownerID).send('The zero system has been deactivated, by:' + message.author.tag.toUpperCase() + ' ('+ message.author.id +')')
      });

    } else {
     send.channel('You do not have sufficient permissions.')
    }

   } else {
    send.channel('The zero system is disabled.')
   }
  }

}