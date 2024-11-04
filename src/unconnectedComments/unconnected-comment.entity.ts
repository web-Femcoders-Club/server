/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class UnconnectedComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;

  @Column({ type: 'longtext' })
  content: string;

  @Column()
  userEmail: string;

  @Column({ default: false })
  approved: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
