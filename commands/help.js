const fs = require('fs'); 

module.exports = (client, message, args, send) => {
 fs.readFile('./help.txt', (err, txt) => {
  if (err) send.log(err)
  send.channel('```asciidoc\n' + txt + '\n```');
 });

}