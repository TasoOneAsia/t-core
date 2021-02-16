import { Connection } from 'typeorm';
import { CharacterEntity as CharacterEntity } from '../db/models/CharacterEntity';
import { Logger } from 'winston';
import { mainLogger } from './logger';
import { ICreateCharacter, UserCharacter } from '../../types';
import { getCharacterRepo } from '../db/repositories/CharacterRepository';
import { getAccountRepo } from '../db/repositories/AccountsRepository';

interface IPlayerOpts {
  source: number;
  identifier: string;
  db: Connection;
}

export default class Player {
  public readonly identifier: string;
  private _logger: Logger = mainLogger.child({
    module: 'player',
  });
  public readonly source: number;
  private _loadedCharacter: boolean = false;
  private _currentCharacter: UserCharacter | null = null;
  private readonly _db: Connection;

  constructor(playerOptions: IPlayerOpts) {
    this.identifier = playerOptions.identifier;
    this.source = playerOptions.source;
    this._db = playerOptions.db;
  }

  public triggerEvent(event: string, ...args: any[]) {
    emitNet(event, this.source, ...args);
  }

  public kickPlayer(reason: string) {
    DropPlayer(this.source.toString(), reason);
  }

  public async createCharacter(
    characterParams: ICreateCharacter
  ): Promise<CharacterEntity | null> {
    try {
      const charRepo = getCharacterRepo(this._db);
      return await charRepo.createNewCharacter({
        playerIdent: this.identifier,
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

  public getCurrentChar(): UserCharacter | null {
    if (this._loadedCharacter && this._currentCharacter) {
      return this._currentCharacter;
    }
    return null;
  }

  public async getCharacters() {
    try {
      const charsRepo = getCharacterRepo(this._db);
      return await charsRepo.getCharactersFromIdent(this.identifier);
    } catch (e) {
      e.prepareStackTrace = null;
      this._logger.error('Failed to get characters');
      this._logger.error(e);
      return null;
    }
  }

  public async useCharacter(id: number): Promise<CharacterEntity | void> {
    try {
      const charsRepo = getCharacterRepo(this._db);
      const char = await charsRepo.getCharacterFromCharId(id);
      this._currentCharacter = char;
      return char;
    } catch (e) {
      e.prepareStackTrace = null;
      this._logger.error('Failed to use character');
      this._logger.error(e);
    }
  }

  public async deleteCharacter(id: number): Promise<void> {
    try {
      const charsRepo = getCharacterRepo(this._db);
      await charsRepo.deleteCharFromId(id);
    } catch (e) {
      e.prepareStackTrace = null;
      this._logger.error('Failed to delete character');
      this._logger.error(e);
    }
  }

  public async getCharacterAccounts() {
    if (this._currentCharacter) {
      try {
        const accountsRepo = getAccountRepo(this._db);
        return await accountsRepo.findAccountsforCharacter(
          this._currentCharacter.characterID
        );
      } catch (e) {
        e.prepareStackTrace = null;
        this._logger.error('Failed to get character accounts');
        this._logger.error(e);
        return null;
      }
    }
  }

  public save(): void {
    // Do saving stuff
  }
}
