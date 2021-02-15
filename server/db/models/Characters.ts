import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  characterID!: number;

  @Column()
  gender!: 'male' | 'female';

  @Column()
  DOB!: string;

  @Column()
  bank!: number;

  @Column()
  cash!: number;

  @Column()
  location!: string;

  @Column()
  playerIdentifier!: string;

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
  })
  @Column()
  name!: string;
  // @Column({
  //   type: 'timestamp',
  //   nullable: false,
  //   default: () => 'CURRENT_TIMESTAMP',
  //   onUpdate: () => 'CURRENT_TIMESTAMP',
  // })
  updatedOn!: Date;
}
