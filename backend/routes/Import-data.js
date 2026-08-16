const fs = require('fs');
const mysql = require('mysql2');
require('dotenv').config(); // Gushyiraho dotenv kugira ngo ifate amakuru muri .env

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'mysql-cfe8eec-ericn2647-91a4.c.aivencloud.com',
  port: process.env.DB_PORT || 21221,
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD, // Irigira mu buryo bwihishwa bwa .env
  database: process.env.DB_NAME || 'defaultdb',
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.error('Ikibazo cyo kwihuza na Aiven:', err);
    return;
  }
  console.log('Twahuje na Aiven neza cyane! Reka twohereze amakuru...');

  fs.readFile('database_backup.sql', 'utf8', (err, sqlQuery) => {
    if (err) {
      console.error('Ntibashije gusoma fayili ya backup:', err);
      return;
    }

    connection.query(sqlQuery, (err, results) => {
      if (err) {
        console.error('Ikibazo mu kohereza amakuru:', err);
      } else {
        console.log('Amakuru yose yoherejwe muri Aiven neza cyane! 🎉');
      }
      connection.end();
    });
  });
});
