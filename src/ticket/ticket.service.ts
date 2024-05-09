import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/entities/ticket.entity';
import { TicketType } from 'src/enums/ticketType.enum';
import { MovieScreeningService } from 'src/movie-screening/movie-screening.service';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { MovieScreening } from 'src/entities/movieScreening.entity';
import 'dotenv/config';
import { EmailService } from 'email/email.service';
import { MovieScreeningTypeEnum } from 'src/enums/movieScreeningType.enum';
import { MovieService } from 'src/movie/movie.service';
import { SeatDTO } from 'src/seat/dtos/seat.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private movieScreeningService: MovieScreeningService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MovieScreening)
    private readonly movieScreeningRepository: Repository<MovieScreening>,
    private emailService: EmailService,
    private movieService: MovieService,
  ) {}

  async buyOrReserveTickets(
    actionType: 'buy' | 'reserve',
    movieScreeningId: number,
    seatIds: number[],
    userId: number,
  ): Promise<Ticket[]> {
    const thisMoment = new Date();
    const twentyFourHoursAhead = new Date(
      thisMoment.getTime() + 24 * 60 * 60 * 1000,
    );
    const ms = await this.movieScreeningRepository.findOne({
      where: {
        id: movieScreeningId,
        status: MovieScreeningTypeEnum.ACTIVE,
        dateAndTime: MoreThan(twentyFourHoursAhead),
      },
    });

    if (!ms) {
      throw new NotFoundException(
        `TICKET FOR MOVIESCREENING WITH ID: ${movieScreeningId} CANNOT BE BOUGHT OR RESERVED (DOES NOT EXIST OR NOT ACTIVE OR 24H EXCEPTION) `,
      );
    }

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
        if (found.ticketStatus === 'BOUGHT') {
          throw new ForbiddenException(
            `TICKET FOR MOVIESCREENING: ${movieScreeningId}, FOR SEAT: ${seatIds[i]} IS ALREADY BOUGHT`,
          );
        } else if (found.ticketStatus === 'RESERVED') {
          throw new ForbiddenException(
            `TICKET FOR MOVIESCREENING: ${movieScreeningId}, FOR SEAT: ${seatIds[i]} IS ALREADY RESERVED`,
          );
        }
      }
    }
    const ticketStatus =
      actionType === 'buy' ? TicketType.BOUGHT : TicketType.RESERVED;
    const reservedAt = actionType === 'reserve' ? thisMoment : null;

    const newTickets: Ticket[] = [];
    for (let i = 0; i < seatIds.length; i++) {
      const temp = await this.ticketRepository.create({
        movieScreeningId: movieScreeningId,
        seatId: seatIds[i],
        userId: userId,
        ticketStatus: ticketStatus,
        reservedAt: reservedAt,
      });
      newTickets.push(temp);
    }

    const savedTickets: Ticket[] = [];
    for (let i = 0; i < newTickets.length; i++) {
      const temp = await this.ticketRepository.save(newTickets[i]);
      savedTickets.push(temp);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (actionType === 'reserve') {
      const reservationDetails = savedTickets;
      await this.sendReservationEmail(user.email, reservationDetails);
    }
    return savedTickets;
  }

  async cancelReservation(ticketId: number, userId: number): Promise<any> {
    const found = await this.ticketRepository.findOne({
      where: { id: ticketId, userId: userId },
    });

    if (!found) {
      throw new NotFoundException(
        `TICKET WITH PROVIDED ID: ${ticketId} FOR USER: ${userId} NOT FOUND`,
      );
    }

    if (found.ticketStatus === 'RESERVED') {
      await this.ticketRepository.delete(ticketId);
      await this.sendCanceledReservationEmail(userId, found);
      return {
        message: `RESERVATION FOR TICKET WITH ID:${ticketId} IS CANCELED`,
      };
    } else {
      throw new ForbiddenException(
        `TICKET WITH ID: ${ticketId} HAS STATUS: ${found.ticketStatus}, AND CANNOT BE CANCELED`,
      );
    }
  }

  async deleteExpiredReservations(): Promise<void> {
    const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);

    const expiredReservations = await this.ticketRepository.find({
      where: {
        ticketStatus: TicketType.RESERVED,
        reservedAt: LessThan(oneMinuteAgo),
      },
    });

    for (const ticket of expiredReservations) {
      await this.ticketRepository.delete(ticket.id);
      await this.sendReservationExpiredEmail(ticket.userId, ticket);
    }
  }

  async sendReservationEmail(
    userEmail: string,
    reservationDetails: any,
  ): Promise<void> {
    console.log('TICKET RESERVED:');
    const reservationText = JSON.stringify(reservationDetails);
    await this.emailService.sendEmail(
      userEmail,
      'Ticket Reservation Details from CINEMA-API',
      reservationText,
    );
  }

  async sendReservationExpiredEmail(
    userId: number,
    ticket: Ticket,
  ): Promise<void> {
    console.log('TICKET EXPIRED:');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const reservationText = JSON.stringify(ticket);
    await this.emailService.sendEmail(
      user.email,
      'Expired Ticket Reservation from CINEMA-API ',
      reservationText,
    );
  }

  async sendCanceledReservationEmail(
    userId: number,
    ticket: Ticket,
  ): Promise<void> {
    console.log('TICKET CANCELED:');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const reservationText = JSON.stringify(ticket);
    await this.emailService.sendEmail(
      user.email,
      'Canceled Ticket Reservation from CINEMA-API ',
      reservationText,
    );
  }

  async getTotalPrice(movieScreeningId: number, userId): Promise<any> {
    const ms = await this.movieScreeningRepository.findOne({
      where: { id: movieScreeningId },
    });

    const movieId = ms.movieId;

    const tickets = await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.user', 'user')
      .leftJoinAndSelect('ticket.movieScreening', 'movie-screening')
      .leftJoinAndSelect('movie-screening.movie', 'movie')
      .where('user.id=:userId', { userId })
      .where('movie-screening.id=:movieScreeningId ', { movieScreeningId })
      .where('movie.id=:movieId', { movieId })
      .getMany();

    let seatIds = [];
    tickets.forEach((t) => {
      seatIds.push(t.seatId);
    });

    const seatDTOs: SeatDTO[] = await this.movieService.calculatePrice(movieId);

    let totalPrice = 0;
    for (let i = 0; i < seatDTOs.length; i++) {
      for (let j = 0; j < seatIds.length; j++) {
        if (seatDTOs[i].seatId === seatIds[j]) {
          console.log(seatDTOs[i]);
          totalPrice = totalPrice + seatDTOs[i].calculatedPrice;
        }
      }
    }
    console.log(totalPrice);

    return `TOTAL PRICE FOR ${tickets.length} TICKETS IS ${totalPrice}`;
  }
}
