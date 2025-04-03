const mysql = require('mysql2');

const initPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12011201'
}).promise();

const initDatabase = async () => {
  try {
    await initPool.query("CREATE DATABASE IF NOT EXISTS nav_app");
    console.log("✅ Database checked/created");

    // 关闭初始连接池
    await initPool.end();

    // 连接 `nav_app` 数据库
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '12011201',
      database: 'nav_app'
    }).promise();

    console.log("✅ Connected to database: nav_app");

    return pool; // **返回正确的 `pool`**
  } catch (err) {
    console.error("❌ Database initialization error:", err);
    process.exit(1);
  }
};

// **确保 `poolPromise` 是一个 `Promise`**
const poolPromise = initDatabase();
module.exports = poolPromise;
