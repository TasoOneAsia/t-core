import { ConnectionManager } from 'typeorm';
import AccountEntity from './models/AccountEntity';
import { CharacterEntity } from './models/CharacterEntity';
import { PlayerEntity } from './models/PlayerEntity';

const connectionManager = new ConnectionManager();

connectionManager.create({
  type: 'mysql',
  port: 3306,
  password: 'devlocal',
  username: 'dev',
  host: 'localhost',
  database: 't-core',
  entities: [AccountEntity, CharacterEntity, PlayerEntity],
  synchronize: true,
});

export default connectionManager;
