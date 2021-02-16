import { ConnectionManager } from 'typeorm';
import Account from './models/Account';
import { Character } from './models/Character';
import { Player } from './models/Player';

const connectionManager = new ConnectionManager();

connectionManager.create({
  type: 'mysql',
  port: parseInt(process.env.DB_PORT) || 3306,
  password: process.env.DB_PASSWORD || undefined,
  username: process.env.DB_USERNAME || 'root',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 't-core',
  entities: [Account, Character, Player],
  synchronize: true,
});

export default connectionManager;
