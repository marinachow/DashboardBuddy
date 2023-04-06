const mysql = require("mysql");
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost", 
    user: "root", 
    password: "", 
    database: "dashboard_db", 
});
pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connection successfull");
    connection.release();
});
module.exports = pool;