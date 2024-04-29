import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { UserTypeGuard } from 'src/auth/guards/user-type.guard';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { UserTypeEnum } from 'src/enums/userType.enum';
import { Genre } from 'src/entities/genre.entity';
import { UserType } from 'src/auth/user-type.decorator';
import GenreCreateDTO from 'src/genre/dtos/genre.create.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Genres')
@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('all')
  async getAllGenres(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<{ genres: Genre[]; totalCount: number }> {
    return await this.genreService.getAllGenres(page, pageSize);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('with-movies')
  async getAllGenresWithMovies(): Promise<Genre[]> {
    return this.genreService.getAllGenresWithMovies();
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('available')
  async getAvailableGenres(): Promise<Genre[]> {
    return await this.genreService.getAvailableGenres();
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('unavailable')
  async getUnavailableGenres(): Promise<Genre[]> {
    return await this.genreService.getUnavailableGenres();
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get(':id')
  async getOneGenre(@Param('id') id: number): Promise<Genre> {
    return await this.genreService.getOneGenre(id);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Post('create')
  async createGenre(@Body() genreCreateDTO: GenreCreateDTO): Promise<Genre> {
    return await this.genreService.createGenre(genreCreateDTO);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Post('enable/:id')
  async enableGenre(@Param('id') id: number): Promise<Genre> {
    return await this.genreService.enableGenre(id);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Post('disable/:id')
  async disableGenre(@Param('id') id: number): Promise<Genre> {
    return await this.genreService.disableGenre(id);
  }
}
