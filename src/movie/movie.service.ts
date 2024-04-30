import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/entities/movie.entity';
import { GenreService } from 'src/genre/genre.service';
import MovieCreateDTO from 'src/movie/dtos/movie.create.dto';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private genreService: GenreService,
  ) {}

  async findOneById(id: number): Promise<Movie | undefined> {
    return await this.movieRepository.findOne({ where: { id } });
  }

  async findForRestore(id: number): Promise<Movie | undefined> {
    return await this.movieRepository.findOne({
      where: { id },
      withDeleted: true,
    });
  }

  async getAllMovies(
    page: number = 1,
    pageSize: number = 100,
  ): Promise<{ movies: Movie[]; totalCount: number }> {
    const [movies, totalCount] = await this.movieRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { movies, totalCount };
  }

  async softDeleteMovie(id: number): Promise<any> {
    const existing = await this.findOneById(id);
    if (!existing) {
      throw new NotFoundException(`MOVIE WITH PROVIDED ID: ${id} NOT FOUND.`);
    }
    await this.movieRepository.softRemove(existing);
    return 'MOVIE SUCCESSFULLY SOFT-DELETED';
  }

  async restoreMovie(id: number): Promise<any> {
    const existing = await this.findForRestore(id);
    if (!existing) {
      throw new NotFoundException(`MOVIE WITH PROVIDED ID: ${id} NOT FOUND.`);
    }
    await this.movieRepository.recover(existing);
    return 'MOVIE SUCESSFULLY RESTORED';
  }

  async getOneMovie(id: number): Promise<Movie> {
    const existing = await this.findOneById(id);
    if (!existing) {
      throw new NotFoundException(
        `MOVIE WITH PROVIDED ID: ${id} NOT FOUND OR SOFT-DELETED.`,
      );
    }
    return existing;
  }

  async getAllMoviesWithGenres(): Promise<Movie[]> {
    return await this.movieRepository.find({ relations: ['genres'] });
  }

  async createMovie(movieCreateDTO: MovieCreateDTO): Promise<Movie> {
    const onlyLettersWithSpaces = /^[a-zA-Z\s]+$/;

    if (!onlyLettersWithSpaces.test(movieCreateDTO.name)) {
      throw new ForbiddenException(
        'MOVIE NAME SHOULD CONTAIN ONLY LETTERS AND SPACES.',
      );
    }

    const newMovieNameToLowercase = movieCreateDTO.name.toLowerCase();
    const allMovies = (await this.getAllMovies()).movies;

    for (let i = 0; i < allMovies.length; i++) {
      const temp = allMovies[i].name.toLowerCase();
      if (temp === newMovieNameToLowercase) {
        throw new ForbiddenException('MOVIE ALREADY EXISTS.');
      }
    }

    //Check if genres that are provided exist in the database
    const allGenres = (await this.genreService.getAllGenres()).genres;

    for (const genreId of movieCreateDTO.genreIds) {
      const genre = allGenres.find((genre) => genre.id === genreId);
      if (!genre) {
        throw new ForbiddenException(
          `GENRE WITH PROVIDED ID: ${genreId} DOES NOT EXIST.`,
        );
      }
    }

    //Check if genres that are provided are not a part of unavailable group of genres
    const unavailableGenres = await this.genreService.getUnavailableGenres();

    for (const genreId of movieCreateDTO.genreIds) {
      const genre = unavailableGenres.find((genre) => genre.id === genreId);
      if (genre) {
        throw new ForbiddenException(
          `GENRE WITH PROVIDED ID: ${genreId} IS CURRENTLY NOT AVAILABLE. IF YOU WANT TO USE IT, TRY TO ENABLE IT.`,
        );
      }
    }

    const genres = await this.genreService.findByIds(movieCreateDTO.genreIds);

    const newMovie = this.movieRepository.create({
      ...movieCreateDTO,
      name:
        movieCreateDTO.name.charAt(0).toUpperCase() +
        movieCreateDTO.name.slice(1),
      genres: genres,
    });

    return await this.movieRepository.save(
      this.movieRepository.create(newMovie),
    );
  }

  async filterMoviesOneGenre(genreId: number): Promise<Movie[]> {
    const unavailableGenres = await this.genreService.getUnavailableGenres();
    const isInUnavailable = unavailableGenres.some(
      (genre) => genre.id === genreId,
    );
    if (isInUnavailable) {
      throw new ForbiddenException(
        `GENRE WITH PROVIDED ID:${genreId} IS UNAVAILABLE. YOU CAN ENABLE IT.`,
      );
    }

    const movies = await this.movieRepository
      .createQueryBuilder('movie')
      .innerJoin('genre_movies_movie', 'mg', 'mg.movieId = movie.id')
      .innerJoin('genre', 'g', 'g.id = mg.genreId')
      .where('g.id = :genreId', { genreId })
      .getMany();

    return movies;
  }

  async filterMoviesMoreGenres(parsedIds: number[]): Promise<Movie[]> {
    const unavailable =
      await this.genreService.getUnavailableGenresParsedIds(parsedIds);

    const unavailableItems: string[] = [];
    unavailable.forEach((u) => {
      unavailableItems.push(
        `GENRE WITH PROVIDED ID:${u.id}( ${u.name} )IS UNAVAILABLE. YOU CAN ENABLE IT.`,
      );
    });

    if (unavailableItems.length > 0) {
      throw new ForbiddenException(unavailableItems.join());
    }

    return await this.movieRepository
      .createQueryBuilder('movie')
      .innerJoin('genre_movies_movie', 'mg', 'mg.movieId = movie.id')
      .innerJoin('genre', 'g', 'g.id = mg.genreId')
      .where('g.id IN (:...genreIds)', { genreIds: parsedIds })
      .getMany();
  }

  async firstLetterFilter(letter: string): Promise<Movie[]> {
    return await this.movieRepository
      .createQueryBuilder('movie')
      .where('LOWER(SUBSTRING(movie.name, 1, 1)) = LOWER(:letter)', { letter })
      .getMany();
  }

  async substringFilter(word: string): Promise<any> {
    return await this.movieRepository
      .createQueryBuilder('movie')
      .where('LOWER(movie.name) LIKE LOWER(:substring)', {
        substring: `%${word}%`,
      })
      .getMany();
  }
}
