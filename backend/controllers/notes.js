const NotesRouter = require('express').Router();
const poolPromise = require('../config/db');

// 获取所有笔记
NotesRouter.get("/", async (req, res) => {
    try {
        const pool = await poolPromise
        const [rows] = await pool.query("SELECT * FROM notes");
        console.log("Fetched notes:", rows);  // 添加日志查看数据
        res.status(200).json(rows);  // 返回数据
    } catch (error) {
        console.error("Error fetching notes:", error);  // 打印错误
        res.status(500).json({ error: "Internal Server Error" });  // 返回详细错误信息
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
NotesRouter.post('/', async (req, res) => {
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
        res.status(201).json(rows[0]);  // 返回完整的笔记数据
    } catch (err) {
        console.error("Error adding note:", err);
        res.status(500).json({ error: err.message });
    }
});


// 更新笔记
NotesRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const pool = await poolPromise;
        const [result] = await pool.query(
            'UPDATE notes SET content = ? WHERE id = ?',
            [content, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ id, content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 删除笔记
NotesRouter.delete('/:id', async (req, res) => {
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
