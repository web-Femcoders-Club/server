// comment.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;

  @Column()
  content: string;

  @Column({ default: false })
  approved: boolean;

  @Column()
  userEmail: string;
}
