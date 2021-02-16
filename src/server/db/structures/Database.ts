import { Connection } from 'typeorm';
import DBConnection from '../connection';
import { Logger } from 'winston';
import { mainLogger } from '../../modules/logger';

export default class Database {
  private readonly db: Connection;
  private _dbLogger: Logger = mainLogger.child({
    module: 'database',
  });
  constructor() {
    this.db = DBConnection.get();
  }

  public async initDb() {
    try {
      await this.db.connect();
      if (process.env.NODE_ENV === 'development') await this.db.synchronize();
      this._dbLogger.info('Connected to database');
    } catch (e) {
      e.prepareStackTrace = null;
      this._dbLogger.error('Unable to connect to DB');
      this._dbLogger.error(e);
    }
  }

  public getConnection(): Connection {
    return this.db;
  }
}
