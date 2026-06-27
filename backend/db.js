const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

async function initDB() {
  try {
    // Connect without a specific database first to create it if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Tarun@2005',
    });

    await connection.query('CREATE DATABASE IF NOT EXISTS phaze_ai_registrations');
    await connection.end();

    // Now create a pool connected to the database
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Tarun@2005',
      database: 'phaze_ai_registrations',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create registrations table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(120) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        ticket_type VARCHAR(50) NOT NULL,
        amount INT NOT NULL,
        status ENUM('PENDING', 'PAID', 'FAILED') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);
    console.log('Database and registrations table initialized successfully.');
    
    return pool;
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
}

function getPool() {
  if (!pool) {
    throw new Error('Database pool has not been initialized yet.');
  }
  return pool;
}

module.exports = { initDB, getPool };
