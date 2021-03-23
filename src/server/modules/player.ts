import { Connection } from 'typeorm';
import { Character } from '../db/models/Character';
import { Logger } from 'winston';
import { mainLogger } from './logger';
import { ICreateCharacter } from '../../types';
import { getCharacterRepo } from '../db/repositories/CharacterRepository';
import { getAccountRepo } from '../db/repositories/AccountsRepository';
import { Ped } from 'fivem-js';
import Account from '../db/models/Account';
import PlayerHandler from '../handlers/PlayerHandler';

interface IPlayerOpts {
  source: number;
  license: string;
  handler: PlayerHandler;
}

export default class Player {
  public readonly license: string;
  private _logger: Logger = mainLogger.child({
    module: 'player',
  });
  private _isDead = false;
  public readonly source: number;
  private _currentCharacter: Character | null;
  private readonly _db: Connection;
  private playerHandler: PlayerHandler;

  constructor(playerOptions: IPlayerOpts) {
    this.license = playerOptions.license;
    this.source = playerOptions.source;
    this.playerHandler = playerOptions.handler;
  }

  public emit(event: string, ...args: any[]): void {
    emitNet(event, this.source, ...args);
  }

  public kickPlayer(reason: string): void {
    DropPlayer(this.source.toString(), reason);
    this._logger.info(`Kicked player (${this.source} for ${reason}`);
  }

  public async createCharacter(
    characterParams: ICreateCharacter
  ): Promise<Character | null> {
    try {
      const charRepo = getCharacterRepo(this._db);
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
    const charRepo = getCharacterRepo(this._db);
    return await charRepo.getCharactersFromLicense(this.license);
  }

  public async useCharacter(id: number): Promise<Character> {
    const charRepo = getCharacterRepo(this._db);
    const character = await charRepo.getCharacterFromCharId(id);
    this._currentCharacter = character;
    return character;
  }

  public async deleteCharacter(id: number): Promise<void> {
    const charRepo = getCharacterRepo(this._db);
    this._logger.debug(`Deleting character ${id} for ${this.license}`);
    return await charRepo.deleteCharFromId(id);
  }

  public async getCharacterAccounts(): Promise<Account[] | null> {
    if (this._currentCharacter) {
      const accountsRepo = getAccountRepo(this._db);
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
