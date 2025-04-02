const CardsRouter = require('express').Router();
const poolPromise = require('../config/db');

// 测试 API
CardsRouter.get('/hello', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

// 获取所有卡片
CardsRouter.get('/', async (req, res) => {
  try {
    const pool = await poolPromise; // 确保数据库连接已初始化
    const [rows] = await pool.query('SELECT * FROM cards ORDER BY `order` ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取单个卡片
CardsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise; // 等待数据库连接
    const [rows] = await pool.query('SELECT * FROM cards WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 创建新的卡片
CardsRouter.post('/', async (req, res) => {
  const { title, description, url, buttonText, isNewTab } = req.body;
  try {
    const pool = await poolPromise;
    const [maxOrderRow] = await pool.query('SELECT MAX(`order`) AS maxOrder FROM cards');
    const maxOrder = maxOrderRow[0]?.maxOrder ?? 0;

    const [result] = await pool.query(
      'INSERT INTO cards (title, description, url, buttonText, isNewTab, `order`) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, url, buttonText, isNewTab ? 1 : 0, maxOrder + 1]
    );

    res.status(201).json({ id: result.insertId, title, description, url, buttonText, isNewTab, order: maxOrder + 1 });
  } catch (err) {
    console.error("Database Error:", err); // 记录详细错误
    res.status(500).json({ error: err.message });
  }
});

// 更新卡片
CardsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, url, buttonText, isNewTab, order } = req.body;
  try {
    const pool = await poolPromise; // 等待数据库连接
    const [result] = await pool.query(
      'UPDATE cards SET title = ?, description = ?, url = ?, buttonText = ?, isNewTab = ?, `order` = ? WHERE id = ?',
      [title, description, url, buttonText, isNewTab, order, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json({ id, title, description, url, buttonText, isNewTab, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 删除卡片
CardsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const [result] = await pool.query('DELETE FROM cards WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 更新卡片顺序
CardsRouter.post('/reorder', async (req, res) => {
  const updatedCards = req.body;  // 前端传来的按新的顺序排列的卡片数据
  try {
    const pool = await poolPromise;
    for (let i = 0; i < updatedCards.length; i++) {
      const { id, order } = updatedCards[i];
      await pool.query('UPDATE cards SET `order` = ? WHERE id = ?', [order, id]);
    }
    res.status(200).json(updatedCards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = CardsRouter;
