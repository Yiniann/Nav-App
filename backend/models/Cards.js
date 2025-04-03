const createCardsTable = async (pool) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        url VARCHAR(512) NOT NULL,
        buttonText VARCHAR(255),
        isNewTab BOOLEAN DEFAULT FALSE,
        \`order\` INT NOT NULL
      )
    `);
    console.log("✅ Cards table checked/created");

    // 检查表是否为空
    const [rows] = await pool.query("SELECT COUNT(*) AS count FROM cards");
    if (rows[0].count === 0) {
      console.log("⚡ Initializing default cards...");

      const initialCards = [
        ["Blog", "YiNiann's Site", "https://en1an.com", "Go to Blog 📖", false, 0],
        ["Shuttle", "Network service", "https://shuttle.en1an.com", "Shuttle 🚀", false, 1],
        ["Tg", "Contact Me", "https://t.me/y1niannn", "Telegram 📬", true, 2],
        ["Image Host", "Picture Management", "https://img.en1an.com", "Lsky 🖼️", true, 3],
        ["Ai", "On-Device LLM", "https://ai.en1an.com", "Open-Web UI 💻", true, 4],
        ["Mcsm", "Game Control Panel", "http://mcsm.en1an.com", "MCSM Panel 🎮", true, 5]
      ];

      await pool.query(`
        INSERT INTO cards (title, description, url, buttonText, isNewTab, \`order\`) 
        VALUES ?`, [initialCards]);

      console.log("✅ Default cards initialized");
    }
  } catch (err) {
    console.error("❌ Error initializing cards table:", err);
  }
};

module.exports = createCardsTable;
