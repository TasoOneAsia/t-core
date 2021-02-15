import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Player {
  @PrimaryColumn()
  license!: string;

  @Column()
  isBanned!: boolean;
}
