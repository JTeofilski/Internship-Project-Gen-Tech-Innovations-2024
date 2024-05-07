import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieScreening } from 'src/entities/movieScreening.entity';
import { Seat } from 'src/entities/seat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(MovieScreening)
    private movieScreeningRepository: Repository<MovieScreening>,
  ) {}

  // Working with virtual field!!!
  async getSeats(movieScreeningId: number): Promise<any> {
    const movieScreening = await this.movieScreeningRepository.findOne({
      where: { id: movieScreeningId },
    });

    const auditoriumId = movieScreening.auditoriumId;

    const seats = await this.seatRepository
      .createQueryBuilder('seat')
      .leftJoinAndSelect(
        'seat.tickets',
        'tickets',
        'tickets.movieScreeningId = :movieScreeningId',
        { movieScreeningId },
      )
      .andWhere('"auditoriumId" = :auditoriumId', { auditoriumId })
      .getMany();
    return seats;
  }

  async calculatedPrice(): Promise<any> {
    const allSeatsFromDB = await this.seatRepository
      .createQueryBuilder('seat')
      .leftJoinAndSelect('seat.auditorium', 'auditorium')
      .leftJoinAndSelect('auditorium.movieScreenings', 'ms')
      .leftJoinAndSelect('ms.movie', 'movie')
      .getMany();

    return allSeatsFromDB;
  }
}
