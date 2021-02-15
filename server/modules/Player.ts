import { Connection } from 'typeorm';
import { Character as CharacterEntity } from '../db/models/Characters';
import { Logger } from 'winston';
import { mainLogger } from './logger';

interface IPlayerOpts {
  source: number;
  identifier: string;
  db: Connection;
}

interface ICreateCharacter {
  name: string;
  DOB: string;
  gender: 'male' | 'female';
}

export interface Character {
  name: string;
  DOB: string;
  gender: 'male' | 'female';
  characterID: number;
  bank: number;
  cash: number;
  playerIdentifier: string;
  location: string;
  createdOn: Date;
  updatedOn: Date;
}

export default class Player {
  public readonly identifier: string;
  private _logger: Logger = mainLogger.child({
    module: 'player',
  });
  public readonly source: number;
  private _loadedCharacter: boolean = false;
  private _currentCharacter: Character | null = null;
  private _db: Connection;

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

  public createCharacter(characterParams: ICreateCharacter) {}

  public getCurrentChar(): Character | null {
    if (this._loadedCharacter && this._currentCharacter) {
      return this._currentCharacter;
    }
    return null;
  }

  public async getCharacters(): Promise<Character[] | null> {
    try {
      const charactersRepo = this._db.getRepository(CharacterEntity);
      const characters: Character[] = await charactersRepo.find({
        where: { playerIdentifier: this.identifier },
      });
      return characters;
    } catch (e) {
      e.prepareStackTrace = null;
      this._logger.error('Failed to get characters');
      this._logger.error(e);
      return null;
    }
  }

  public useCharacter(id: number) {
    // Switch character
  }

  public deleteCharacter(id: number): void {
    // Delete character
  }

  public save(): void {
    // Do saving stuff
  }
}
