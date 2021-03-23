// import { Logger } from 'winston';
// import { mainLogger } from './logger';
// import Player from './player';
// import { Connection } from 'typeorm';
// import connectionManager from '../db/connection';
//
// interface IPlayersBySource {
//   [source: number]: Player;
// }
//
// interface IPlayersByLicense {
//   [license: string]: Player;
// }
//
// interface IPlayersByCharacter {
//   [characterId: number]: Player;
// }
//
// export default class TCore {
//   private _logger: Logger;
//   public db: Connection = connectionManager.get();
//   private playersByLicense: IPlayersByLicense = {};
//   private playersBySource: IPlayersBySource = {};
//   private playersByCharacter: IPlayersByCharacter = {};
//
//   constructor() {
//     this._logger = mainLogger.child({
//       module: 'core',
//     });
//   }
//
//   public async loadPlayer(player: Player): Promise<void> {
//     this._logger.debug(`Loading player ${player.license}`);
//     // Player already loaded into memory
//     if (this.playersBySource[player.source]) return;
//     this.playersBySource[player.source] = player;
//     this.playersByLicense[player.license] = player;
//   }
//
//   public disconnectPlayer(source: number): void {
//     const user = this.playersBySource[source];
//     user.save();
//     delete this.playersBySource[source];
//     delete this.playersByLicense[user.license];
//     const character = user.getCurrentChar();
//     if (character) delete this.playersByCharacter[character.characterID];
//   }
//
//   public kickPlayer(user: Player, reason: string): void {
//     DropPlayer(user.source.toString(), reason);
//     this.disconnectPlayer(user.source);
//   }
// }
