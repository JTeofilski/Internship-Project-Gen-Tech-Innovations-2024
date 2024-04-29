import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from 'src/entities/genre.entity';
import GenreCreateDTO from 'src/genre/dtos/genre.create.dto';
import { Repository } from 'typeorm';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async findOneById(id: number): Promise<Genre | undefined> {
    return await this.genreRepository.findOne({ where: { id } });
  }

  async findByIds(ids: number[]): Promise<Genre[]> {
    const genres: Genre[] = [];
    for (let i = 0; i < ids.length; i++) {
      const oneId = await this.findOneById(ids[i]);
      genres.push(oneId);
    }
    return genres;
  }

  async getAllGenres(
    page: number = 1,
    pageSize: number = 100,
  ): Promise<{ genres: Genre[]; totalCount: number }> {
    const [genres, totalCount] = await this.genreRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { genres, totalCount };
  }

  async getAvailableGenres(): Promise<Genre[]> {
    return await this.genreRepository.find({ where: { isDeleted: false } });
  }

  async getUnavailableGenres(): Promise<Genre[]> {
    return await this.genreRepository.find({ where: { isDeleted: true } });
  }

  async getOneGenre(id: number): Promise<Genre> {
    const existing = await this.findOneById(id);
    if (!existing) {
      throw new NotFoundException('GENRE WITH PROVIDED ID NOT FOUND');
    }
    return existing;
  }

  async getAllGenresWithMovies(): Promise<Genre[]> {
    return await this.genreRepository.find({ relations: ['movies'] });
  }

  async disableGenre(id: number): Promise<Genre> {
    const existing = await this.findOneById(id);

    if (!existing) {
      throw new NotFoundException(
        'GENRE WITH PROVIDED ID DOES NOT EXIST IN THE DATABASE',
      );
    } else if (existing) {
      const disabled = await this.getUnavailableGenres();
      const isInDisabled = disabled.some((genre) => genre.id === existing.id);
      if (isInDisabled) {
        throw new ForbiddenException('GENRE WITH PROVIDED ID ALREADY DISABLED');
      }
      existing.isDeleted = true;
      this.genreRepository.save(existing);
      return existing;
    }
  }

  async enableGenre(id: number): Promise<Genre> {
    const existing = await this.findOneById(id);

    if (!existing) {
      throw new NotFoundException(
        'GENRE WITH PROVIDED ID DOES NOT EXIST IN THE DATABASE',
      );
    } else if (existing) {
      const enabled = await this.getAvailableGenres();
      const isInEnabled = enabled.some((genre) => genre.id === existing.id);
      if (isInEnabled) {
        throw new ForbiddenException(
          'GENRE WITH PROVIDED ID IS ALREADY ENABLED',
        );
      }
      existing.isDeleted = false;
      this.genreRepository.save(existing);
      return existing;
    }
  }

  async createGenre(genreCreateDTO: GenreCreateDTO): Promise<Genre> {
    const onlyLetters = /^[a-zA-Z]+$/;

    if (!onlyLetters.test(genreCreateDTO.name)) {
      throw new ForbiddenException('GENRE NAME SHOULD CONTAIN ONLY LETTERS');
    }

    const newGenreNameToLowercase = genreCreateDTO.name.toLowerCase();
    const availabledGenres = await this.getAvailableGenres();
    const unavailableGenres = await this.getUnavailableGenres();

    for (let i = 0; i < unavailableGenres.length; i++) {
      const temp = unavailableGenres[i].name.toLowerCase();
      if (temp === newGenreNameToLowercase) {
        throw new ForbiddenException(
          'GENRE ALREADY EXISTS BUT IS UNAVAILABLE. TRY TO ENABLE IT.',
        );
      }
    }

    for (let i = 0; i < availabledGenres.length; i++) {
      const temp = availabledGenres[i].name.toLowerCase();
      if (temp === newGenreNameToLowercase) {
        throw new ForbiddenException('GENRE ALREADY EXISTS AND IS AVAILABLE.');
      }
    }

    genreCreateDTO.name =
      genreCreateDTO.name.charAt(0).toUpperCase() +
      genreCreateDTO.name.slice(1);

    return await this.genreRepository.save(
      this.genreRepository.create(genreCreateDTO),
    );
  }
}
