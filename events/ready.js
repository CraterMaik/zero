const sqlite3 = require('sqlite3').verbose();
const config = require('../config');
const db = new sqlite3.Database('./zero_db.sqlite3');

module.exports = (client) => {
 client.user.setPresence({
  status: "online",
  game: {
   name: 'Zero system | '+ config.PREFIX_BOT,
   url: null,
   type: "PLAYING"
  }
 });

 db.run('CREATE TABLE IF NOT EXISTS countBans (idguild TEXT, count INTEGER, status INTEGER)');
 db.run('CREATE TABLE IF NOT EXISTS countKicks (idguild TEXT, count INTEGER, status INTEGER)');
 db.run('CREATE TABLE IF NOT EXISTS zeroRoles (idguild TEXT, idrole TEXT, status INTENGER)');

}