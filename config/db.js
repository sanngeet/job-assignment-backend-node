var mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: '12345678',
  database: 'ssd',
});

const connectDB = async () => {
  try {
    await con.connect();
    console.log('Mysql DB Connected...');
  } catch (err) {
    console.error(err.message);
    Process.exit(1);
  }
};

module.exports = {
  getConnection: () => {
    return con;
  },
  connectDB,
};
