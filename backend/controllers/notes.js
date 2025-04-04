const NotesRouter = require('express').Router();
const poolPromise = require('../config/db');
const authMiddleware = require('../middlewares/auth');

// 获取所有笔记
NotesRouter.get("/", async (req, res) => {
    try {
        const pool = await poolPromise
        const [rows] = await pool.query("SELECT * FROM notes");
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 获取单个笔记
NotesRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const [rows] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 创建新笔记
NotesRouter.post('/', authMiddleware, async (req, res) => {
    const { content } = req.body;
  
    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Content is required and must be a string" });
    }
  
    try {
      const pool = await poolPromise;
      const [result] = await pool.query(
        'INSERT INTO notes (content) VALUES (?)',
        [content]
      );
  
      const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [result.insertId]);
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error("Error adding note:", err);
      res.status(500).json({ error: err.message });
    }
  });


// 更新笔记
NotesRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // 如果内容为空或者无效
  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "Content is required and must be a string" });
  }

  try {
    // 使用 poolPromise 来获取数据库连接池
    const pool = await poolPromise;
    
    // 执行更新操作
    const [result] = await pool.query("UPDATE notes SET content = ? WHERE id = ?", [content, id]);
    
    if (result.affectedRows > 0) {
      res.status(200).json({ id, content });
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

  

// 删除笔记
NotesRouter.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
      const pool = await poolPromise;
      const [result] = await pool.query('DELETE FROM notes WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Note not found' });
      }
      res.status(200).json({ id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = NotesRouter;
