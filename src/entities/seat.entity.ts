import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
  getRepository,
} from 'typeorm';
import { Auditorium } from './auditorium.entity';
import { Ticket } from './ticket.entity';
import { Expose } from 'class-transformer';
import { NotFoundError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  row: number;

  @Column()
  column: number;

  @Column()
  auditoriumId: number;

  @Column({ default: 1 })
  percentage: number;

  @ManyToOne(() => Auditorium, (auditorium) => auditorium.seats, {
    onDelete: 'SET NULL',
  })
  auditorium: Auditorium;

  @OneToMany(() => Ticket, (ticket) => ticket.seat)
  tickets: Ticket[];

  @Expose()
  get isOccupied(): boolean {
    return !!this.tickets?.length;
  }

  @Expose()
  get calculatedPrice() {
    if (this.auditorium == null) {
      throw new NotFoundException('AUDITORIUM NOT FOUND');
    }
    const movies = this.auditorium.movieScreenings.map((ms) => ms.movie);
    let newPrice = 0;

    movies.forEach((movie) => {
      const price = movie.price;
      const onePercent = price / 100;

      switch (this.percentage) {
        case 1:
          newPrice = price + onePercent * 5;
          break;
        case 2:
          newPrice = price - onePercent * 5;
          break;
        default:
          newPrice = price;
          break;
      }
    });

    return newPrice;
  }
}
