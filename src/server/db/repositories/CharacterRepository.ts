import { EntityRepository, Repository, Connection } from 'typeorm';
import { CharacterEntity } from '../models/CharacterEntity';
import { ICreateCharacter } from '../../../types';

@EntityRepository(CharacterEntity)
class CharacterRepository extends Repository<CharacterEntity> {
  async createNewCharacter(charParams: ICreateCharacter): Promise<CharacterEntity> {
    const char = new CharacterEntity();
    char.DOB = charParams.DOB;
    char.gender = charParams.gender;
    char.name = charParams.name;
    char.playerIdentifier = charParams.playerIdent;
    return await this.save(char);
  }

  async getCharactersFromIdent(
    playerIdent: string
  ): Promise<CharacterEntity[] | CharacterEntity> {
    return await this.find({ where: { playerIdentifier: playerIdent } });
  }

  async getCharacterFromCharId(charId: number): Promise<CharacterEntity> {
    const char = await this.findOne({ where: { characterID: charId } });
    if (char) return char;
    throw new Error(`Could not find character for ${charId}`);
  }

  async deleteCharFromId(charId: number): Promise<void> {
    await this.update({ isDeleted: true }, { characterID: charId });
  }
}

export const getCharacterRepo = (connection: Connection) =>
  connection.getCustomRepository(CharacterRepository);
