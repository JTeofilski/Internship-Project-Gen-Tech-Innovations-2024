import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { Movie } from 'src/entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreModule } from 'src/genre/genre.module';

@Module({
  imports: [GenreModule, TypeOrmModule.forFeature([Movie])], // GenreService is exported in GenreModule, that is why I have to import GenreModule if I want to use GenreService
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
