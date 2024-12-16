import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  icon: string;

  @Column()
  title: string;

  @Column()
  description: string;
}
