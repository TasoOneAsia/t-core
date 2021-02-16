import { Column, Entity, PrimaryColumn } from 'typeorm';

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
}
