import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { Ticket } from 'src/entities/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieScreeningModule } from 'src/movie-screening/movie-screening.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), MovieScreeningModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
