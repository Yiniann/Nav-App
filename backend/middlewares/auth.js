const jwt = require('jsonwebtoken');
const poolPromise = require('../config/db');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: '未提供认证令牌' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await poolPromise.query('SELECT id FROM users WHERE id = ?', [decoded.id]);
    
    if (!user.length) return res.status(401).json({ error: '无效的用户' });
    
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: '认证失败', details: err.message });
  }
};