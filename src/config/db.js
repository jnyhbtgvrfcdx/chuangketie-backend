const mysql = require('mysql2/promise');

let pool;

function getDbConfig() {
  const {
    DB_HOST,
    DB_PORT = '3306',
    DB_USER,
    DB_PASSWORD = '',
    DB_NAME,
    DB_CONNECTION_LIMIT = '10',
  } = process.env;

  if (!DB_HOST || !DB_USER || !DB_NAME) {
    const missing = ['DB_HOST', 'DB_USER', 'DB_NAME'].filter((key) => !process.env[key]);
    throw new Error(`数据库配置缺失: ${missing.join(', ')}`);
  }

  return {
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(DB_CONNECTION_LIMIT),
    queueLimit: 0,
  };
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool(getDbConfig());
  }

  return pool;
}

async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

module.exports = {
  getPool,
  query,
};
