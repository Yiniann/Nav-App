const express = require('express');
const cors = require('cors');
const app = express();

const poolPromise = require('./config/db');
const createCardsTable = require('./models/Cards');
const createNotesTable = require('./models/Notes');
// 中间件
app.use(cors());
app.use(express.json());

// 引入路由
const cardRoutes = require('./controllers/cards');
const noteRoutes = require('./controllers/notes');

(async () => {
  try {
    const pool = await poolPromise; // **等待数据库连接**
    await createCardsTable(pool);
    await createNotesTable(pool);
    console.log("✅ 数据库初始化完成");
  } catch (err) {
    console.error("❌ 数据库初始化失败:", err);
  }
})();

// 使用路由
app.use('/cards', cardRoutes);
app.use('/notes', noteRoutes);



module.exports = app;
