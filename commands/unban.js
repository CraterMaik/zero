const config = require('../config');

module.exports = async (client, message, args, send) => {
 if (!message.channel.guild) return send.channel('This command only for servers.');
 let member = args[0];
 let reason = args.slice(1).join(" ");

 if (member) {
  if (!message.guild.members.get(client.user.id).hasPermission(['BAN_MEMBERS'])) return send.channel('I do not have permission to ban.');
  if (!reason) return send.channel(`You must provide a reason for the unban, __**Example:** ${config.PREFIX_BOT}unban <iduser> <reason>__`);
  let status = message.guild.members.get(message.guild.ownerID).presence.status
  if (status) {
   if (status === 'offline' || status === 'idle') {
    if (message.member.hasPermission('ADMINISTRATOR')) {
     message.guild.unban(member, reason).then((user) => {
      send.channel('```py\nSUCCESSFULLY UNBANNED\n🚷 USER UNBANNED: ' + user.tag.toUpperCase() + ' (' + user.id + ')' + '\n📋 REASON: ' + reason + '\n👤 BY: ' + message.author.tag.toUpperCase() + '\n```');

     }).catch(err => {
      send.channel('I was unable to unban the member.');
      console.error(err);

     });
    } else {
     send.channel(`You can not revoke a member's ban when zero mode is enabled, wait for the server owner to connect or contact a server administrator.`)
    }

   } else {
    let hasperms = message.member.hasPermission(['BAN_MEMBERS']);
    if (!hasperms) return send.channel('You do not have sufficient permissions.');
    message.guild.unban(member, reason).then((user) => {
     send.channel('```py\nSUCCESSFULLY UNBANNED\n🚷 USER UNBANNED: ' + user.tag.toUpperCase() + ' (' + user.id + ')' + '\n📋 REASON: ' + reason + '\n👤 BY: ' + message.author.tag.toUpperCase() + '\n```');

    }).catch(err => {
     send.channel('I was unable to unban the member.');
     console.error(err);

    });
   }
  }

 } else {
  send.channel(`You must mention a member, __**Example:** ${config.PREFIX_BOT}unban <iduser> <reason>__`);

 }
}