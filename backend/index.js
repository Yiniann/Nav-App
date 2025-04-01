const express = require('express')
const pool = require('./db')
const cors = require('cors');


const app = express()
const PORT = 3001

app.use(cors());  // 允许所有来源的请求
app.use(express.json());  // 解析 JSON 格式的请求体


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//get all cards
app.get('/cards', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cards ORDER BY `order` ASC');
    res.json(rows);  
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 获取单个卡片
app.get('/cards/:id', async (req, res) => {
  const { id } = req.params;
  try {
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
app.post('/cards', async (req, res) => {
  const { title, description, url, buttonText, isNewTab } = req.body;
  try {
    // 获取当前最大 order
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
app.put('/cards/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, url, buttonText, isNewTab, order } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE cards SET title = ?, description = ?, url = ?, buttonText = ?, isNewTab = ?, order = ? WHERE id = ?',
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
app.delete('/cards/:id', async (req, res) => {
  const { id } = req.params;
  try {
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
app.post('/cards/reorder', async (req, res) => {
  const updatedCards = req.body;  // 前端传来的按新的顺序排列的卡片数据
  try {
    for (let i = 0; i < updatedCards.length; i++) {
      const { id, order } = updatedCards[i];
      await pool.query('UPDATE cards SET `order` = ? WHERE id = ?', [order, id]);
    }
    res.status(200).json(updatedCards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})