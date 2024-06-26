import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { Ticket } from 'src/entities/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieScreeningModule } from 'src/movie-screening/movie-screening.module';
import { User } from 'src/entities/user.entity';
import { MovieScreening } from 'src/entities/movieScreening.entity';
import { EmailService } from 'email/email.service';
import { CronService } from 'cron/cron.service';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, User, MovieScreening]),
    MovieScreeningModule,
    MovieModule,
  ],
  controllers: [TicketController],
  providers: [TicketService, /*CronService, */ EmailService],
  exports: [TicketService],
})
export class TicketModule {}
