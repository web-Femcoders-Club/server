/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class EventAttendee {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  eventbriteAttendeeId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  dni: string | null;

  @Column({ nullable: true })
  orderFirstName: string | null;

  @Column({ nullable: true })
  orderLastName: string | null;

  @Column({ nullable: true })
  orderEmail: string | null;

  @Column({ default: false })
  isManual: boolean;

  @Column()
  eventId: string;

  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  event: Event;
}
