require('dotenv').config();

const mysql = require('mysql2');

const initPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD, 
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

const initDatabase = async () => {
  try {
    await initPool.query("CREATE DATABASE IF NOT EXISTS nav_app");
    console.log("✅ Database checked/created");

    await initPool.end();


    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: 'nav_app',
      port: parseInt(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    }).promise();

    console.log("✅ Connected to database: nav_app");
    return pool;
  } catch (err) {
    console.error("❌ Database initialization error:", err);
    process.exit(1);
  }
};

const poolPromise = initDatabase();
module.exports = poolPromise;