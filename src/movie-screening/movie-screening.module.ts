import { Module } from '@nestjs/common';
import { MovieScreeningController } from './movie-screening.controller';
import { MovieScreeningService } from './movie-screening.service';
import { MovieScreening } from 'src/entities/movieScreening.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from 'src/movie/movie.module';
import { AuditoriumModule } from 'src/auditorium/auditorium.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieScreening]),
    MovieModule,
    AuditoriumModule,
  ],
  controllers: [MovieScreeningController],
  providers: [MovieScreeningService],
})
export class MovieScreeningModule {}
