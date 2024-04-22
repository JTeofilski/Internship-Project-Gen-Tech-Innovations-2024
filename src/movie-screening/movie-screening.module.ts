import { Module } from '@nestjs/common';
import { MovieScreeningController } from './movie-screening.controller';
import { MovieScreeningService } from './movie-screening.service';
import { MovieScreening } from 'src/entities/movieScreening.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from 'src/movie/movie.module';
import { AuditoriumModule } from 'src/auditorium/auditorium.module';
import { GenreModule } from 'src/genre/genre.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieScreening]),
    MovieModule,
    AuditoriumModule,
    GenreModule,
  ],
  controllers: [MovieScreeningController],
  providers: [MovieScreeningService],
  exports: [MovieScreeningService],
})
export class MovieScreeningModule {}
