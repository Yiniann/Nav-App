const express = require('express');
const cors = require('cors');
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 引入路由
const cardRoutes = require('./controllers/cards');

// 使用路由
app.use('/cards', cardRoutes);

module.exports = app;
