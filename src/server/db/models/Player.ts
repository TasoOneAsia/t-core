import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Character } from './Character';

@Entity()
export class Player {
  @PrimaryColumn()
  license!: string;

  @Column({
    default: false,
    nullable: false,
    type: 'boolean',
  })
  isBanned!: boolean;

  @Column({
    default: false,
    nullable: false,
    type: 'boolean',
  })
  isAdmin!: boolean;

  @OneToMany(() => Character, (character) => character.player)
  characters: Character[];
}
