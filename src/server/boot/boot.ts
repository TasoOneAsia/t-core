import { mainLogger } from '../modules/logger';
import { ServerCore } from '../server';
import Database from '../db/structures/Database';

on('onResourceStart', async (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    mainLogger.info('Sucessfully started');
    const db = new Database();
    await db.initDb();
  }
});
