/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('increment')
  idEvent: number;

  @Column()
  eventName: string;

  @Column()
  eventStart: Date;

  @Column()
  eventEnd: Date;

  @Column()
  eventTimezone: string;

  @Column()
  eventCurrency: string;
}

