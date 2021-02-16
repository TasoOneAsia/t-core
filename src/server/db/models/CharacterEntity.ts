import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CharacterEntity {
  @PrimaryGeneratedColumn()
  characterID!: number;

  @Column({
    nullable: false,
  })
  gender!: 'male' | 'female';

  @Column({
    nullable: false,
  })
  DOB!: string;

  @Column()
  location!: string;

  @Column({
    nullable: false,
  })
  playerIdentifier!: string;

  @Column({
    default: null,
  })
  group!: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdOn!: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedOn!: Date;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  name!: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted!: boolean;
}
