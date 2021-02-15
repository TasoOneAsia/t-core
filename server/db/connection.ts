import { ConnectionManager } from 'typeorm';

const connectionManager = new ConnectionManager();

connectionManager.create({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(<string>process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || undefined,
  database: process.env.DB_NAME || 't-core',
});

export default connectionManager;
