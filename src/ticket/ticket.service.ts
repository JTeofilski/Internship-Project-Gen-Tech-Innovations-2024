import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/entities/ticket.entity';
import { MovieScreeningService } from 'src/movie-screening/movie-screening.service';
import { Repository } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private movieScreeningService: MovieScreeningService,
  ) {}

  async buyTickets(
    movieScreeningId: number,
    seatIds: number[],
    userId,
  ): Promise<Ticket[]> {
    for (let i = 0; i < seatIds.length; i++) {
      const check = await this.movieScreeningService.seatExists(
        movieScreeningId,
        seatIds[i],
      );
      if (!check) {
        throw new ForbiddenException(
          `SEAT WITH PROVIDED ID: ${seatIds[i]} DOES NOT EXIST IN AUDITORIUM`,
        );
      }
    }

    for (let i = 0; i < seatIds.length; i++) {
      const found = await this.ticketRepository.findOne({
        where: { movieScreeningId: movieScreeningId, seatId: seatIds[i] },
      });
      if (found) {
        throw new ForbiddenException(
          `OCCUPIED - TICKET FOR PROVIDED SEAT ID: ${seatIds[i]} EXIST`,
        );
      }
    }

    const newTickets: Ticket[] = [];
    for (let i = 0; i < seatIds.length; i++) {
      const temp = await this.ticketRepository.create({
        movieScreeningId: movieScreeningId,
        seatId: seatIds[i],
        userId: userId,
      });
      newTickets.push(temp);
    }

    const savedTickets: Ticket[] = [];
    for (let i = 0; i < newTickets.length; i++) {
      const temp = await this.ticketRepository.save(newTickets[i]);
      savedTickets.push(temp);
    }
    return savedTickets;
  }
}
