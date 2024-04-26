import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/entities/ticket.entity';
import { TicketType } from 'src/enums/ticketType.enum';
import { MovieScreeningService } from 'src/movie-screening/movie-screening.service';
import { LessThan, Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { User } from 'src/entities/user.entity';
import { MovieScreening } from 'src/entities/movieScreening.entity';
import 'dotenv/config';
import { EmailService } from 'email/email.service';

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
  ) {}

  async buyOrReserveTickets(
    actionType: 'buy' | 'reserve',
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
    const reservedAt = actionType === 'reserve' ? new Date() : null;

    const ms = await this.movieScreeningRepository.findOne({
      where: { id: movieScreeningId },
    });

    if (actionType === 'reserve') {
      if (reservedAt >= ms.dateAndTime) {
        throw new ForbiddenException(
          'CANNOT BE RESERVED. (reservedAt >= ms.dateAndTime) ',
        );
      }
    }

    if (actionType === 'buy') {
      const currentDateAndTime = new Date();
      if (currentDateAndTime >= ms.dateAndTime) {
        throw new ForbiddenException(
          'CANNOT BE BOUGHT. (currentDateAndTime >= ms.dateAndTime) ',
        );
      }
    }

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
      await await this.sendReservationEmail(user.email, reservationDetails);
    }
    return savedTickets;
  }

  async cancelReservation(ticketId: number, userId): Promise<any> {
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

  /*async sendEmail(
    userEmail: string,
    subject: string,
    message: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.TRANSPORTER_USER,
        pass: process.env.TRANSPORTER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.TRANSPORTER_USER,
      to: userEmail,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  }*/

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
}
