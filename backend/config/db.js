require('dotenv').config();

const mysql = require('mysql2');

// 初始化连接池
const initPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// 初始化数据库并创建连接池
const initDatabase = async () => {
  try {
    // 创建数据库
    await initPool.query("CREATE DATABASE IF NOT EXISTS nav_app");
    console.log("✅ Database checked/created");

    // 切换数据库
    await initPool.query("USE nav_app");

    // 保持连接池活跃，返回连接池对象
    console.log("✅ Connected to database: nav_app");
    return initPool;
  } catch (err) {
    console.error("❌ Database initialization error:", err);
    process.exit(1);  // 退出程序以防数据库初始化失败
  }
};

const poolPromise = initDatabase();
module.exports = poolPromise;
