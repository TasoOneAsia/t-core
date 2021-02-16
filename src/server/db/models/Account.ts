import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Account {
  @PrimaryGeneratedColumn()
  accountId!: number;

  @Column()
  accountType!: string;

  @Column()
  playerIdentifier!: string;

  @Column()
  characterId!: number;

  @Column()
  balance!: number;

  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastUpdated!: Date;
}
