import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from './movie.entity';
import { Auditorium } from './auditorium.entity';
import { Ticket } from './ticket.entity';
import { MovieScreeningTypeEnum } from 'src/enums/movieScreeningType.enum';

@Entity()
export class MovieScreening {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp with time zone' })
  dateAndTime: Date;

  @Column({
    type: 'enum',
    enum: MovieScreeningTypeEnum,
    default: MovieScreeningTypeEnum.ACTIVE,
  })
  status: MovieScreeningTypeEnum;

  @Column()
  movieId: number;

  @ManyToOne(() => Movie, (movie) => movie.movieScreenings, {
    onDelete: 'SET NULL',
  })
  movie: Movie;

  @Column()
  auditoriumId: number;

  @ManyToOne(() => Auditorium, (auditorium) => auditorium.movieScreenings, {
    onDelete: 'SET NULL',
  })
  auditorium: Auditorium;

  @OneToMany(() => Ticket, (ticket) => ticket.movieScreening)
  tickets: Ticket[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
