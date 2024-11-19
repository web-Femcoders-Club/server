/* eslint-disable prettier/prettier */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  start_local: string;

  @Column({ nullable: true })
  location: string;

  @Column()
  description: string;

  @Column()
  event_url: string;

  @Column({ nullable: true })
  logo_url: string;
}
