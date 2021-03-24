import TCore from '../boot/TCore';
import { Command, CommandListener } from '../lib/decorators/Commands';
import { Logger } from 'winston';
import { mainLogger } from './logger';

@CommandListener()
export default class AdminModule {
  private core: TCore;
  private log: Logger = mainLogger.child({
    module: 'admin',
  });

  constructor(core: TCore) {
    this.core = core;
  }

  @Command({
    command: 'debugPlayers',
  })
  public debugPlayers(): void {
    const players = this.core.playerHandler.getPlayers();
    console.log(players);
  }

  @Command({
    command: 'setAdmin',
  })
  public setAdmin(_source: number, [rawTarget, rawBool]: [string, string]): void {
    try {
      const targetSource = parseInt(rawTarget);

      if (!(_source === 0) && !this.core.playerHandler.getPlayer(_source).getIsAdmin()) {
        return this.notifyError(_source, 'No permissions for this command');
      }
      if (!rawTarget || !rawBool) {
        return this.notifyError(_source, 'Incorrect command args');
      }

      if (targetSource === 0)
        return this.notifyError(_source, 'Invalid target for command');

      const player = this.core.playerHandler.getPlayer(targetSource);

      const bool = JSON.parse(rawBool.toLowerCase());

      if (isNaN(targetSource)) return this.notifyError(_source);

      player
        .setAdmin(bool)
        .then(() => this.log.info(`Set source ${targetSource} admin to ${bool}`))
        .catch((e) => this.log.error(`Could not set admin ${e.message}`));

      player.emit('t-notify:client:Custom', {
        style: 'info',
        duration: 5000,
        message: `⚠ Admin status set to **${bool}** ⚠`,
        sound: true,
      });
    } catch (e) {
      this.notifyError(
        _source,
        'Error occured running command, double check your arguments'
      );
      this.log.error(e.message);
    }
  }
  @Command({
    command: 'kick',
  })
  public kickPlayer(_source: number, [rawTarget]: [string]): void {
    if (!(_source === 0) && !this.core.playerHandler.getPlayer(_source).getIsAdmin()) {
      return this.notifyError(_source, 'No permissions for this command');
    }

    if (!rawTarget) {
      return this.notifyError(_source, 'Incorrect command args');
    }

    const targetSource = parseInt(rawTarget);

    if (targetSource === 0)
      return this.notifyError(_source, 'Invalid target for command');

    const targetPlayer = this.core.playerHandler.getPlayer(targetSource);
    const sourcePlayer = this.core.playerHandler.getPlayer(_source);

    targetPlayer.kickPlayer(`You have been kicked by ${sourcePlayer.username}`);
  }

  private notifyError(
    _source: number,
    message = 'Error occured running command, double check your arguments'
  ): void {
    if (_source !== 0) {
      return emitNet('t-notify:client:Custom', _source, {
        style: 'error',
        duration: 4000,
        message,
        sound: true,
      });
    }

    this.log.error(`${message}`);
  }

  @Command({
    command: 'spawnveh',
  })
  private spawnVeh(_source: string, [model]: [string]): void {
    const ped = GetPlayerPed(_source);
    const coords = GetEntityCoords(ped);
    const modelHash = GetHashKey(model);
    // Change this to CREATE_AUTOMOBILE if i ever figure out how to actually invoke that native
    // in v8 ScRT
    CreateVehicle(modelHash, coords[0], coords[1], coords[2], 180, true, true);
  }

  private async hasPermission(_source): Promise<boolean> {
    if (_source === 0) return true;
    return await this.core.playerHandler.getPlayer(_source).fetchIsAdmin();
  }
}
