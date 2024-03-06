import { Module } from '@nestjs/common';
import { MovieScreeningController } from './movie-screening.controller';
import { MovieScreeningService } from './movie-screening.service';
import { MovieScreening } from 'src/entities/movieScreening.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MovieScreening])],
  controllers: [MovieScreeningController],
  providers: [MovieScreeningService],
})
export class MovieScreeningModule {}
