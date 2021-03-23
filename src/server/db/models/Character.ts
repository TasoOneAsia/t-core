import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player as CorePlayer } from './Player';

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  characterID!: number;

  @ManyToOne(() => CorePlayer, (player) => player.characters)
  player: CorePlayer;

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
  playerLicense!: string;

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
