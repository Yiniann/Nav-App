const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',      
  user: 'root',           
  password: '12011201', 
  database: 'nav_app'  
});

module.exports = pool.promise();
