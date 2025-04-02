const mysql = require('mysql2');

// 初始连接（不指定 database）
const initPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12011201'
}).promise();

// 创建数据库并初始化最终连接池
const initDatabase = async () => {
  try {
    await initPool.query("CREATE DATABASE IF NOT EXISTS nav_app");
    console.log("✅ Database checked/created");

    // 关闭初始连接池
    await initPool.end();

    // 创建新的连接池，连接到 `nav_app`
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '12011201',
      database: 'nav_app'
    }).promise();

    console.log("✅ Connected to database: nav_app");
    return pool;
  } catch (err) {
    console.error("❌ Database initialization error:", err);
    process.exit(1);
  }
};

// 立即初始化数据库，并导出 `poolPromise`
const poolPromise = initDatabase();
module.exports = poolPromise;
