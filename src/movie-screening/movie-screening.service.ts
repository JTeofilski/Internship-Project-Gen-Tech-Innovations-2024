import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addHours } from 'date-fns';
import { AuditoriumService } from 'src/auditorium/auditorium.service';
import { MovieScreening } from 'src/entities/movieScreening.entity';
import MovieScreeningCreateDTO from 'src/movie-screening/dtos/movie-screening.create.dto';
import MovieScreeningEditDTO from 'src/movie-screening/dtos/movie-screening.edit.dto';
import { MovieService } from 'src/movie/movie.service';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class MovieScreeningService {
  constructor(
    @InjectRepository(MovieScreening)
    private readonly movieScreeningRepository: Repository<MovieScreening>,
    private readonly movieService: MovieService,
    private readonly auditoriumService: AuditoriumService,
  ) {}

  // isDeleted is false by default
  async findOneFromDTO(movieScreeningCreateDTO: MovieScreeningCreateDTO) {
    return await this.movieScreeningRepository.findOne({
      where: {
        dateAndTime: movieScreeningCreateDTO.dateAndTime,
        movie: { id: movieScreeningCreateDTO.movieId },
        auditorium: { id: movieScreeningCreateDTO.auditoriumId },
      },
    });
  }

  async checkOverlap(
    auditoriumId: number,
    dateAndTime: Date,
    movieId: number,
  ): Promise<void> {
    const date = new Date(dateAndTime);
    date.setHours(0, 0, 0, 0);

    const queryBuilder: SelectQueryBuilder<MovieScreening> =
      this.movieScreeningRepository
        .createQueryBuilder('movieScreening')
        .leftJoinAndSelect('movieScreening.movie', 'movie')
        .where('movieScreening.auditoriumId = :auditoriumId', { auditoriumId })
        .andWhere('CAST(movieScreening.dateAndTime AS DATE) = :date', { date });

    const existingMovieScreenings = await queryBuilder.getMany();

    const sortedExistingMovieScreenings = existingMovieScreenings.sort((a, b) =>
      a.dateAndTime.toISOString().localeCompare(b.dateAndTime.toISOString()),
    );

    const movieDuration = (await this.movieService.findOneById(movieId))
      .duration;

    const temp = new Date(dateAndTime);
    const newStartTime = new Date(0);
    newStartTime.setUTCHours(
      temp.getUTCHours(),
      temp.getUTCMinutes(),
      temp.getUTCSeconds(),
    );

    const newEndTime = addHours(newStartTime, movieDuration);

    for (let i = 0; i < sortedExistingMovieScreenings.length; i++) {
      const movieDurationExist =
        sortedExistingMovieScreenings[i].movie.duration;
      const temp1 = new Date(sortedExistingMovieScreenings[i].dateAndTime);
      const existingStartTime = new Date(0);
      existingStartTime.setUTCHours(
        temp1.getUTCHours(),
        temp1.getUTCMinutes(),
        temp1.getUTCSeconds(),
      );

      const existingEndTime = addHours(existingStartTime, movieDurationExist);

      if (
        (newStartTime <= existingStartTime &&
          newEndTime >= existingStartTime) ||
        (newEndTime >= existingEndTime && newStartTime <= existingEndTime) ||
        (newStartTime >= existingStartTime && newEndTime <= existingEndTime)
      ) {
        throw new ConflictException('THERE IS TIME OVERLAP');
      }
    }
  }

  async adminCreatesMovieScreening(
    movieScreeningDTO: MovieScreeningCreateDTO,
  ): Promise<MovieScreening> {
    const existingMovieScreening = await this.findOneFromDTO(movieScreeningDTO);

    if (existingMovieScreening) {
      throw new ConflictException('MOVIE_SCREENING ALREADY EXISTS');
    }

    const now = new Date();
    const providedDateAndTime = new Date(movieScreeningDTO.dateAndTime);

    if (isNaN(providedDateAndTime.getTime()) || providedDateAndTime < now) {
      throw new ConflictException(
        'DATE AND TIME FOR MOVIE_SCREENING CANNOT BE IN THE PAST',
      );
    }

    const movie = await this.movieService.findOneById(
      movieScreeningDTO.movieId,
    );

    if (!movie) {
      throw new NotFoundException('MOVIE WITH PROVIDED ID DOES NOT EXIST');
    }

    const auditorium = await this.auditoriumService.findOneById(
      movieScreeningDTO.auditoriumId,
    );

    if (!auditorium) {
      throw new NotFoundException('AUDITORIUM WITH PROVIDED ID DOES NOT EXIST');
    }

    await this.checkOverlap(
      movieScreeningDTO.auditoriumId,
      movieScreeningDTO.dateAndTime,
      movieScreeningDTO.movieId,
    );

    const movieScreening = new MovieScreening();
    movieScreening.movie = movie;
    movieScreening.auditorium = auditorium;

    Object.assign(movieScreening, movieScreeningDTO);

    return await this.movieScreeningRepository.save(
      this.movieScreeningRepository.create(movieScreening),
    );
  }

  async findOneById(id: number): Promise<MovieScreening | undefined> {
    return await this.movieScreeningRepository.findOne({ where: { id } });
  }

  async adminEditsMovieScreening(
    id: number,
    movieScreeningDTO: MovieScreeningEditDTO,
  ): Promise<MovieScreening> {
    const movieScreening = await this.movieScreeningRepository
      .createQueryBuilder('movieScreening')
      .leftJoinAndSelect('movieScreening.movie', 'movie')
      .leftJoinAndSelect('movieScreening.auditorium', 'auditorium')
      .where('movieScreening.id = :id', { id })
      .getOne();

    if (!movieScreening) {
      throw new NotFoundException(
        'MOVIE_SCREENING WITH PROVIDED ID DOES NOT EXIST IN DATABASE',
      );
    }

    if (movieScreeningDTO.movieId !== undefined) {
      const movie = await this.movieService.findOneById(
        movieScreeningDTO.movieId,
      );
      if (!movie) {
        throw new NotFoundException('MOVIE WITH PROVIDED ID DOES NOT EXIST');
      }
      movieScreening.movie = movie;
    }

    if (movieScreeningDTO.auditoriumId !== undefined) {
      const auditorium = await this.auditoriumService.findOneById(
        movieScreeningDTO.auditoriumId,
      );

      if (!auditorium) {
        throw new NotFoundException(
          'AUDITORIUM WITH PROVIDED ID DOES NOT EXIST',
        );
      }
      movieScreening.auditorium = auditorium;
    }

    const now = new Date().getTime();

    if (movieScreeningDTO.dateAndTime !== undefined) {
      const screeningTime = new Date(movieScreeningDTO.dateAndTime).getTime();
      if (screeningTime <= now) {
        throw new ConflictException(
          'DATE AND TIME FOR MOVIE_SCREENING CANNOT BE IN THE PAST',
        );
      } else if (screeningTime > now) {
        if (
          movieScreeningDTO.auditoriumId !== undefined &&
          movieScreeningDTO.movieId !== undefined
        ) {
          await this.checkOverlap(
            movieScreeningDTO.auditoriumId,
            movieScreeningDTO.dateAndTime,
            movieScreeningDTO.movieId,
          );
        } else if (
          movieScreeningDTO.auditoriumId == undefined &&
          movieScreeningDTO.movieId !== undefined
        ) {
          await this.checkOverlap(
            movieScreening.auditorium.id,
            movieScreeningDTO.dateAndTime,
            movieScreeningDTO.movieId,
          );
        } else if (
          movieScreeningDTO.auditoriumId !== undefined &&
          movieScreeningDTO.movieId == undefined
        ) {
          await this.checkOverlap(
            movieScreeningDTO.auditoriumId,
            movieScreeningDTO.dateAndTime,
            movieScreening.movie.id,
          );
        } else {
          await this.checkOverlap(
            movieScreening.auditorium.id,
            movieScreeningDTO.dateAndTime,
            movieScreening.movie.id,
          );
        }
      }
    }

    Object.assign(movieScreening, movieScreeningDTO);
    return await this.movieScreeningRepository.save(movieScreening);
  }

  async adminGetsMovieScreenings(): Promise<MovieScreening[]> {
    const movieScreenings = await this.movieScreeningRepository
      .createQueryBuilder('movieScreening')
      .leftJoinAndSelect('movieScreening.movie', 'movie')
      .leftJoinAndSelect('movieScreening.auditorium', 'auditorium')
      .getMany();

    return movieScreenings;
  }

  async adminDeletesMovieScreening(id: number): Promise<MovieScreening> {
    const toBeDeletedMS = await this.findOneById(id);

    if (!toBeDeletedMS) {
      throw new NotFoundException(
        'MOVIE-SCREENING WITH PROVIDED ID DOES NOT EXIST IN THE DATABASE',
      );
    } else {
      await this.movieScreeningRepository.delete(id);
      return toBeDeletedMS;
    }
  }
}
