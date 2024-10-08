/* eslint-disable prettier/prettier */
// comment.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ default: false })
  approved: boolean;

  @Column()
  userEmail: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  
}

