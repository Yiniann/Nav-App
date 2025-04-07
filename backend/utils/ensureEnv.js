const fs = require('fs')
const path = require('path')

function ensureEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    const defaultEnv = `PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_PORT=3306
JWT_SECRET=7U3doasdf3*DAKLDSF
DB_NAME=nav_app
`;
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ .env 文件自动生成完成');
  } else {
    console.log('ℹ️ 已检测到 .env 文件，跳过生成');
  }
}

module.exports = ensureEnv;