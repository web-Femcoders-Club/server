import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Achievement } from '../../achievements/entities/achievements.entity';

@Entity('user_achievements')
export class UserAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  achievementId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Achievement)
  @JoinColumn({ name: 'achievementId' })
  achievement: Achievement;
}
