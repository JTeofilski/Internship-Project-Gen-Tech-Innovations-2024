import { Module } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { Seat } from 'src/entities/seat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieScreening } from 'src/entities/movieScreening.entity';
import { Auditorium } from 'src/entities/auditorium.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seat, MovieScreening, Auditorium])],
  controllers: [SeatController],
  providers: [SeatService],
  exports: [SeatService],
})
export class SeatModule {}
