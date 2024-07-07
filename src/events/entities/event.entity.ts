/* eslint-disable prettier/prettier */
// src/events/entities/event.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column()
  timezone: string;

  @Column()
  currency: string;

  @Column()
  status: string;
}


