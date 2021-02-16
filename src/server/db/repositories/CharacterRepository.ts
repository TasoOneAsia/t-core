import { EntityRepository, Repository, Connection } from 'typeorm';
import { Character } from '../models/Character';
import { ICreateCharacter } from '../../../types';

@EntityRepository(Character)
class CharacterRepository extends Repository<Character> {
  async createNewCharacter(charParams: ICreateCharacter): Promise<Character> {
    const char = new Character();
    char.DOB = charParams.DOB;
    char.gender = charParams.gender;
    char.name = charParams.name;
    char.playerLicense = charParams.playerIdent;
    return await this.save(char);
  }

  async getCharactersFromLicense(license: string): Promise<Character[]> {
    return await this.find({ where: { playerLicense: license } });
  }

  async getCharacterFromCharId(charId: number): Promise<Character> {
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
