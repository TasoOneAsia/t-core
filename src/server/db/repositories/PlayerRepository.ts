import { Connection, EntityRepository, Repository } from 'typeorm';
import { Player } from '../models/Player';

@EntityRepository(Player)
export class PlayerRepository extends Repository<Player> {
  async createPlayer(license: string): Promise<Player> {
    const newPlayer = new Player();
    newPlayer.license = license;
    return await this.save(newPlayer);
  }

  async setPlayerAdmin(license: string, bool: boolean): Promise<void> {
    await this.update({ isAdmin: bool }, { license: license });
  }

  async setPlayerBanned(license: string, bool: boolean): Promise<void> {
    await this.update({ isBanned: bool }, { license: license });
  }
}

export const getPlayerRepo = (db: Connection) => db.getCustomRepository(PlayerRepository);
