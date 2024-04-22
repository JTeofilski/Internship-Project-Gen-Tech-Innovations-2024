import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MovieScreening } from './movieScreening.entity';
import { Genre } from './genre.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  duration: number;

  @Column()
  price: number;

  @OneToMany(() => MovieScreening, (movieScreening) => movieScreening.movie)
  movieScreenings: MovieScreening[];

  @ManyToMany(() => Genre, (genre) => genre.movies)
  genres: Genre[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
