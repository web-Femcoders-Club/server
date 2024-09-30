/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserAvatar {
  @PrimaryGeneratedColumn('increment')
  idAvatar: number;

  @Column()
  avatar_url: string;

  @ManyToOne(() => User, (user) => user.idUser)
  user: User;
}



