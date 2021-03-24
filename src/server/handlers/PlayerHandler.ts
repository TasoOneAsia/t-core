import { mainLogger } from '../modules/logger';
import Player from '../modules/player';
import { Event, EventListener } from '../lib/decorators/Events';
import { Player as PlayerModel } from '../db/models/Player';
import { Delay } from '../../shared/MiscUtils';
import TCore from '../boot/TCore';
import { PlayerRepository } from '../db/repositories/PlayerRepository';
import getLicenseFromSource from '../utils/getLicenseFromSource';
import { getSource } from '../utils/miscUtils';

@EventListener()
export default class PlayerHandler {
  private log = mainLogger.child({
    module: 'PlayerHandler',
  });

  public core: TCore;

  private playersBySource = new Map<number, Player>();
  private playersByLicense = new Map<string, Player>();

  constructor(core: TCore) {
    this.core = core;
    this.log.debug('Started!');
  }

  public getPlayer(_source: number): Player {
    const player = this.playersBySource.get(_source);
    if (!player) throw new Error('Could not find player with that source');
    return player;
  }

  public getPlayerByLicense(license: string): Player {
    const player = this.playersByLicense.get(license);
    if (!player) throw new Error('Could not find player with that license');
    return player;
  }

  private _connectPlayer(source: number): void {
    try {
      const license = getLicenseFromSource(source);
      const player = new Player({ handler: this, source, license });
      // Fetch admin status and update
      player.fetchIsAdmin().catch((e) => this.log.error(e));
      // Add to maps
      this.playersBySource.set(source, player);
      this.playersByLicense.set(license, player);
      this.log.info(`Connected player with source ${source}`);
    } catch (e) {
      this.log.error(e);
    }
  }

  private _disconnectPlayer(source: number) {
    const playerLicense = this.playersBySource.get(source).license;
    this.playersByLicense.delete(playerLicense);
    this.playersBySource.delete(source);
    this.log.info(`Disconnected player with source ${source}`);
  }

  public async resolvePlayer(_source: number): Promise<PlayerModel | void> {
    const playerRepo = this.core.db.getCustomRepository(PlayerRepository);
    const filteredLicense = getLicenseFromSource(_source);
    try {
      let resolvedPlayer = await playerRepo.findOne(filteredLicense);

      if (!resolvedPlayer) {
        resolvedPlayer = await playerRepo.createPlayer(filteredLicense);
      }
      return resolvedPlayer;
    } catch (e) {
      this.log.error(e.message);
    }
  }

  public isPlayerBanned(player: PlayerModel): boolean {
    if (player.isBanned) {
      this.log.debug(`Rejecting ${player.license} for ban`);
    }
    return player.isBanned;
  }

  public getPlayers(): number[] {
    const players: number[] = [];
    for (const [source, player] of this.playersBySource) {
      players.push(source);
    }
    return players;
  }

  @Event('playerConnecting')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private async onConnect(name: string, kickReason: string, defferals: any) {
    const _source = getSource();
    defferals.defer();
    await Delay(0);
    defferals.update('Resolving player...');
    const player = await this.resolvePlayer(_source);
    if (!player) {
      await Delay(0);
      return defferals.done('Error resolving your license');
    }
    defferals.update('Checking ban status...');
    if (this.isPlayerBanned(player)) {
      await Delay(0);
      return defferals.done('You are banned from this server!');
    }
    await Delay(0);
    defferals.done();
  }

  @Event('playerJoining')
  private onPermSource() {
    const _source = getSource();
    this._connectPlayer(_source);
  }

  @Event('playerDropped')
  private onDisconnect() {
    const _source = getSource();
    this._disconnectPlayer(_source);
  }

  @Event('onServerResourceStart')
  private async debugStart(resource: string) {
    await Delay(2000);
    if (resource === GetCurrentResourceName()) {
      // Workaround till https://github.com/citizenfx/fivem/pull/682
      // is merged
      // @ts-ignore
      const onlinePlayers: string[] = getPlayers();
      for (const player of onlinePlayers) {
        this._connectPlayer(parseInt(player));
      }
    }
  }
}
