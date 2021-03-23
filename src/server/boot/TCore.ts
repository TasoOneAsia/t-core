import { Logger } from 'winston';
import { mainLogger } from '../modules/logger';
import PlayerHandler from '../handlers/PlayerHandler';
import Database from '../db/connection';

export default class TCore {
  private _log: Logger = mainLogger.child({
    module: 'core',
  });

  public db = Database.get();

  public playerHandler = new PlayerHandler(this);

  async start(): Promise<void> {
    try {
      this._log.info('Starting DB');
      await this.db.connect();
      if (process.env.NODE_ENV === 'development') {
        this._log.info('DB Synchronizing');
        await this.db.synchronize();
      }
      this._log.info('Core started!');
    } catch (e) {
      this._log.error('Error on start!', e.message);
    }
  }
}
