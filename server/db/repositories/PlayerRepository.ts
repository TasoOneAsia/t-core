import { EntityRepository, Repository, Connection } from 'typeorm';
import { PlayerEntity } from '../models/PlayerEntity';

@EntityRepository(PlayerEntity)
class PlayerRepository extends Repository<PlayerEntity> {
  async createPlayer(license: string): Promise<PlayerEntity> {
    const newPlayer = new PlayerEntity();
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

export const getPlayerRepo = (connection: Connection) =>
  connection.getCustomRepository(PlayerRepository);
