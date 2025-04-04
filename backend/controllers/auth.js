const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const poolPromise = require('../config/db');  // 导入数据库连接池初始化

const router = express.Router();

// 注册路由
router.post('/register', async (req, res) => {
  try {
    // 等待数据库连接池初始化
    const pool = await poolPromise;

    const { username, email, password } = req.body;

    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({ error: '所有字段都是必填的' });
    }

    console.log("Checking if user exists...");

    // 检查用户是否已存在
    const [existingUser] = await pool.query(
      'SELECT * FROM users WHERE email = ?', [email]
    );

    console.log("Existing User Query Result: ", existingUser);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: '该邮箱已被注册' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Inserting new user...");

    // 创建用户
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', 
      [username, email, hashedPassword]
    );

    console.log("Insert User Result: ", result);

    if (!result.affectedRows) {
      return res.status(500).json({ error: '创建用户失败，请稍后再试' });
    }

    // 生成JWT token
    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        username,
        email
      }
    });
  } catch (err) {
    console.error('注册错误:', err);
    res.status(500).json({
      error: '注册失败',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 登录路由
router.post('/login', async (req, res) => {
  try {
    // 等待数据库连接池初始化
    const pool = await poolPromise;

    console.log("Attempting to log in user...");

    const { username, password } = req.body;

    // 查找用户
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?', [username]
    );

    console.log("Login Query Result: ", users);

    if (!users.length) {
      return res.status(401).json({ error: '无效的账号或密码' });
    }

    const user = users[0];

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: '无效的账号或密码' });
    }

    // 生成JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json({
      error: '登录失败',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
