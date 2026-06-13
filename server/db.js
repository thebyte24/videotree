const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT || 3306,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

async function initDB() {
  const conn = await pool.getConnection()

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS events (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      slug       VARCHAR(255) NOT NULL UNIQUE,
      couple     VARCHAR(255) NOT NULL,
      location   VARCHAR(255) DEFAULT '',
      date       VARCHAR(100) DEFAULT '',
      tagline    VARCHAR(500) DEFAULT '',
      story      JSON,
      coverImage VARCHAR(500) DEFAULT '',
      sections   JSON,
      \`order\`  INT DEFAULT 0,
      createdAt  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS gallery_categories (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      slug        VARCHAR(255) NOT NULL UNIQUE,
      label       VARCHAR(255) NOT NULL,
      description TEXT,
      coverImage  VARCHAR(500) DEFAULT '',
      photos      JSON,
      \`order\`   INT DEFAULT 0,
      createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS site_config (
      id        INT AUTO_INCREMENT PRIMARY KEY,
      \`key\`   VARCHAR(255) NOT NULL UNIQUE,
      value     JSON NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id        INT AUTO_INCREMENT PRIMARY KEY,
      name      VARCHAR(255) NOT NULL,
      rating    TINYINT NOT NULL DEFAULT 5,
      text      TEXT NOT NULL,
      \`order\` INT DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Safe migration: add youtubeUrl to gallery_categories if missing
  const [gcCols] = await conn.execute(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'gallery_categories' AND COLUMN_NAME = 'youtubeUrl'
  `)
  if (gcCols.length === 0) {
    await conn.execute(`ALTER TABLE gallery_categories ADD COLUMN youtubeUrl VARCHAR(500) DEFAULT ''`)
    console.log('✓ Added youtubeUrl to gallery_categories')
  }

  // Safe migration: add youtubeUrl to events if missing
  const [evCols] = await conn.execute(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'events' AND COLUMN_NAME = 'youtubeUrl'
  `)
  if (evCols.length === 0) {
    await conn.execute(`ALTER TABLE events ADD COLUMN youtubeUrl VARCHAR(500) DEFAULT ''`)
    console.log('✓ Added youtubeUrl to events')
  }

  conn.release()
  console.log('✓ MySQL tables ready')
}

module.exports = { pool, initDB }
