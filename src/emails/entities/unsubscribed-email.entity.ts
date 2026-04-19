/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('unsubscribed_email')
export class UnsubscribedEmail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @CreateDateColumn({ type: 'timestamp' })
  unsubscribedAt: Date;

  @Column({ nullable: true, length: 100 })
  source: string | null;
}
