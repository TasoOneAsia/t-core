import { Character } from '../db/models/Character';
import { Logger } from 'winston';
import { mainLogger } from './logger';
import { ICreateCharacter } from '../../types';
import { getCharacterRepo } from '../db/repositories/CharacterRepository';
import { getAccountRepo } from '../db/repositories/AccountsRepository';
import { Ped } from 'fivem-js';
import Account from '../db/models/Account';
import PlayerHandler from '../handlers/PlayerHandler';
import { getPlayerRepo } from '../db/repositories/PlayerRepository';

interface IPlayerOpts {
  source: number;
  license: string;
  handler: PlayerHandler;
}

export default class Player {
  private _logger: Logger = mainLogger.child({
    module: 'player',
  });
  public readonly license: string;
  private _isDead = false;
  public readonly source: number;
  public readonly username: string;
  private _currentCharacter: Character | null;
  private playerHandler: PlayerHandler;
  private _admin: boolean;

  constructor(playerOptions: IPlayerOpts) {
    this.license = playerOptions.license;
    this.source = playerOptions.source;
    this.playerHandler = playerOptions.handler;

    this.username = GetPlayerName(playerOptions.source.toString());
  }

  public emit(event: string, ...args: any[]): void {
    emitNet(event, this.source, ...args);
  }

  public kickPlayer(reason: string): void {
    DropPlayer(this.source.toString(), reason);
    this._logger.info(`Kicked player (${this.source}) for "${reason}"`);
  }

  public async createCharacter(
    characterParams: ICreateCharacter
  ): Promise<Character | null> {
    try {
      const charRepo = getCharacterRepo(this.playerHandler.core.db);
      return await charRepo.createNewCharacter({
        playerIdent: this.license,
        name: characterParams.name,
        gender: characterParams.gender,
        DOB: characterParams.DOB,
      });
    } catch (e) {
      e.prepareStackTrace = null;
      this._logger.error('Failed to create character');
      this._logger.error(e);
      return null;
    }
  }

  public getCurrentChar(): Character | null {
    return this._currentCharacter;
  }

  public async getCharacters(): Promise<Character[]> {
    const charRepo = getCharacterRepo(this.playerHandler.core.db);
    return await charRepo.getCharactersFromLicense(this.license);
  }

  public async fetchIsAdmin(): Promise<boolean> {
    const playerRepo = getPlayerRepo(this.playerHandler.core.db);
    const playerModel = await playerRepo.findOne({
      where: {
        license: this.license,
      },
    });
    this._admin = playerModel.isAdmin;
    return playerModel.isAdmin === true;
  }

  public getIsAdmin(): boolean {
    return this._admin;
  }

  public async setAdmin(bool: boolean): Promise<void> {
    const playerRepo = getPlayerRepo(this.playerHandler.core.db);
    await playerRepo.setPlayerAdmin(this.license, bool);
    this._admin = bool;
  }

  public async useCharacter(id: number): Promise<Character> {
    const charRepo = getCharacterRepo(this.playerHandler.core.db);
    const character = await charRepo.getCharacterFromCharId(id);
    this._currentCharacter = character;
    return character;
  }

  public async deleteCharacter(id: number): Promise<void> {
    const charRepo = getCharacterRepo(this.playerHandler.core.db);
    this._logger.debug(`Deleting character ${id} for ${this.license}`);
    return await charRepo.deleteCharFromId(id);
  }

  public async getCharacterAccounts(): Promise<Account[] | null> {
    if (this._currentCharacter) {
      const accountsRepo = getAccountRepo(this.playerHandler.core.db);
      return await accountsRepo.findAccountsforCharacter(
        this._currentCharacter.characterID
      );
    }
    return null;
  }

  public getPlayerPed(): Ped {
    return Ped.fromNetworkId(this.source) as Ped;
  }

  public save(): void {
    // Do saving stuff
  }
}
