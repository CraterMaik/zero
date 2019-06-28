module.exports = (client, message) => {
 if (!message.content.startsWith(client.config.PREFIX_BOT)) return;
 if (message.author.bot) return;

 const args = message.content.slice(client.config.PREFIX_BOT.length).trim().split(/ +/g);
 const command = args.shift().toLowerCase()

 let cmd = client.commands.get(command);
 if (!cmd) return;
 let send = {
  channel: function (text) {
   message.channel.send(text)
  },
  author: function (text) {
   message.author.send(text)
  },
  log: function (text) {
   console.log(text)
  },
  global: function (id, text) {
   client.channels.get(id).send(text)
  },
  user: function (id, text) {
   client.users.get(id).send(text)
  }
 }
 cmd(client, message, args, send);

}