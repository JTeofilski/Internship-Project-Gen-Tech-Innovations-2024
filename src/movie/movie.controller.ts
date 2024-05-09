import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { UserTypeGuard } from 'src/auth/guards/user-type.guard';
import { UserType } from 'src/auth/user-type.decorator';
import { Movie } from 'src/entities/movie.entity';
import { UserTypeEnum } from 'src/enums/userType.enum';
import { FirtsLetterFilterDTO } from 'src/movie/dtos/first.letter.filter.dto';
import MovieCreateDTO from 'src/movie/dtos/movie.create.dto';
import { SubstringFilterDTO } from 'src/movie/dtos/substring.filter.dto';
import { MovieService } from 'src/movie/movie.service';
import { SeatDTO } from 'src/seat/dtos/seat.dto';

@ApiTags('Movies')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('substring')
  async substringFilter(@Query() query: SubstringFilterDTO): Promise<Movie[]> {
    return await this.movieService.substringFilter(query.word);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('first-letter')
  async firstLetterFilter(
    @Query() query: FirtsLetterFilterDTO,
  ): Promise<Movie[]> {
    return await this.movieService.firstLetterFilter(query.letter);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('filter-more-genres')
  async filterMoviesMoreGenres(
    @Query('genreIds') genreIds: string,
  ): Promise<Movie[]> {
    const parsedIds: number[] = genreIds
      .split(',')
      .map((numStr) => parseInt(numStr.trim(), 10));
    if (parsedIds.some(isNaN)) {
      throw new BadRequestException('NaN');
    }
    return await this.movieService.filterMoviesMoreGenres(parsedIds);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('filter-one-genre/:id')
  async filterMoviesOneGenre(@Param('id') id: number): Promise<Movie[]> {
    return await this.movieService.filterMoviesOneGenre(id);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('all')
  async getAllMovies(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<{ movies: Movie[]; totalCount: number }> {
    return await this.movieService.getAllMovies(page, pageSize);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('with-genres')
  async getAllMoviesWithGenres(): Promise<Movie[]> {
    return this.movieService.getAllMoviesWithGenres();
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get(':id')
  async getOneMovie(@Param('id') id: number): Promise<Movie> {
    return await this.movieService.getOneMovie(id);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Delete('soft-delete/:id')
  async softDeleteMovie(@Param('id') id: number): Promise<any> {
    return await this.movieService.softDeleteMovie(id);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Post('restore/:id')
  async restoreMovie(@Param('id') id: number): Promise<any> {
    return await this.movieService.restoreMovie(id);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Post('create')
  async createMovie(@Body() genreCreateDTO: MovieCreateDTO): Promise<Movie> {
    return await this.movieService.createMovie(genreCreateDTO);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @Get('seat-price/:id')
  async calculatePrice(@Param('id') id: number): Promise<SeatDTO[]> {
    return await this.movieService.calculatePrice(id);
  }
}
