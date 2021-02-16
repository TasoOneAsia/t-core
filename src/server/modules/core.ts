import { Logger } from 'winston';
import { mainLogger } from './logger';
import Player from './player';
import { Connection, getConnectionManager } from 'typeorm';
import connectionManager from '../db/connection';

interface IPlayersBySource {
  [source: number]: Player;
}

interface IPlayersByLicense {
  [license: string]: Player;
}

interface IPlayersByCharacter {
  [characterId: number]: Player;
}

export default class TCore {
  private _logger: Logger;
  private _db: Connection = connectionManager.get();
  private playersByLicense: IPlayersByLicense = {};
  private playersBySource: IPlayersBySource = {};
  private playersByCharacter: IPlayersByCharacter = {};

  constructor() {
    this._logger = mainLogger.child({
      module: 'core',
    });
  }

  public connectPlayer(source: number) {
    if (this.playersBySource[source]) return;
  }

  public loadPlayer(_source: number) {
    const identifiers = getPlayerIdentifiers(_source.toString());
    const rockStarLicense = identifiers.find((identifier) =>
      identifier.includes('license:')
    );
  }

  public disconnectPlayer(source: number) {
    const user = this.playersBySource[source];
    user.save();
    delete this.playersBySource[source];
    delete this.playersByLicense[user.identifier];
    const character = user.getCurrentChar();
    if (character) delete this.playersByCharacter[character.characterID];
  }

  public kickPlayer(user: Player, reason: string) {
    DropPlayer(user.source.toString(), reason);
  }
}
