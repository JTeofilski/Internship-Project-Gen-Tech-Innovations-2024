import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MovieScreening } from './movieScreening.entity';
import { Seat } from './seat.entity';

@Entity()
export class Auditorium {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    () => MovieScreening,
    (movieScreening) => movieScreening.auditorium,
  )
  movieScreenings: MovieScreening[];

  @OneToMany(() => Seat, (seat) => seat.auditorium)
  seats: Seat[];
}
