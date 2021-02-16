import { ConnectionManager } from 'typeorm';
import AccountEntity from './models/AccountEntity';
import { CharacterEntity } from './models/CharacterEntity';
import { PlayerEntity } from './models/PlayerEntity';

const connectionManager = new ConnectionManager();

connectionManager.create({
  type: 'mysql',
  port: parseInt(process.env.DB_PORT) || 3306,
  password: process.env.DB_PASSWORD || undefined,
  username: process.env.DB_USERNAME || 'root',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 't-core',
  entities: [AccountEntity, CharacterEntity, PlayerEntity],
  synchronize: true,
});

export default connectionManager;
