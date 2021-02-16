import { Logger } from 'winston';
import { mainLogger } from './logger';
import { getPlayerRepo } from '../db/repositories/PlayerRepository';
import { Connection } from 'typeorm';
import connectionManager from '../db/connection';
import { PlayerEntity } from '../db/models/PlayerEntity';
import { Delay } from '../../shared/MiscUtils';

class Connect {
  public _logger: Logger = mainLogger.child({
    module: 'connect',
  });
  private _connection: Connection = connectionManager.get();

  public async resolvePlayer(_source: number): Promise<PlayerEntity | void> {
    const identifiers = getPlayerIdentifiers(_source.toString());
    const filteredLicense = identifiers.find((identifier) =>
      identifier.includes('license')
    );
    if (!filteredLicense) {
      this._logger.error('License was not parsed properly');
      return null;
    }
    const playerRepo = getPlayerRepo(this._connection);
    let resolvedPlayer = await playerRepo.findOne(filteredLicense);
    if (!resolvedPlayer) {
      const newPlayer = new PlayerEntity();
      newPlayer.license = filteredLicense;
      resolvedPlayer = await playerRepo.save(newPlayer);
      this._logger.debug(`Created new Player for ${resolvedPlayer.license}`);
    }
    return resolvedPlayer;
  }
  public isPlayerBanned(player: PlayerEntity): boolean {
    if (player.isBanned) {
      this._logger.debug(`Rejecting ${player.license} for ban`);
    }
    return player.isBanned;
  }
}

const ConnectInst = new Connect();

on('playerConnecting', async (name: string, kickReason: string, defferals: any) => {
  const _source = (global as any).source;
  defferals.defer();
  await Delay(0);
  defferals.update('Resolving player...');
  const player = await ConnectInst.resolvePlayer(_source);
  if (!player) {
    await Delay(0);
    return defferals.done('Error resolving your license');
  }
  defferals.update('Checking ban status...');
  if (ConnectInst.isPlayerBanned(player)) {
    await Delay(0);
    return defferals.done('You are banned from this server!');
  }
  await Delay(0);
  defferals.done();
});
