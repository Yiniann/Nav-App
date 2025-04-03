const createNotesTable = async (pool) => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS notes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("✅ Notes 表已创建");
  
      // 检查表是否为空
      const [rows] = await pool.query("SELECT COUNT(*) AS count FROM notes");
      if (rows[0].count === 0) {
        console.log("⚡ 初始化默认笔记...");
        const initialNotes = [
          ["First Note", "This is your first note! 🎉"],
          ["Second Note", "Welcome to your note-taking app! 📒"]
        ];
        await pool.query(`
          INSERT INTO notes (title, content) VALUES ?`, [initialNotes]);
        console.log("✅ 默认笔记已初始化");
      }
    } catch (err) {
      console.error("❌ 创建 Notes 表失败:", err);
    }
  };
  
  module.exports = createNotesTable;
  