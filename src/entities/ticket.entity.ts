import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MovieScreening } from './movieScreening.entity';
import { Seat } from './seat.entity';
import { User } from './user.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movieScreeningId: number;

  @Column()
  seatId: number;

  @Column()
  userId: number;

  @ManyToOne(() => MovieScreening, (moviescreening) => moviescreening.tickets, {
    onDelete: 'SET NULL',
  })
  movieScreening: MovieScreening;

  @ManyToOne(() => Seat, (seat) => seat.tickets, { onDelete: 'SET NULL' })
  seat: Seat;

  @ManyToOne(() => User, (user) => user.tickets, { onDelete: 'SET NULL' })
  user: User;
}
