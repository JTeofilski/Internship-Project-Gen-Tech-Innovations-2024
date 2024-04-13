import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { UserTypeGuard } from 'src/auth/guards/user-type.guard';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { UserTypeEnum } from 'src/enums/userType.enum';
import { Genre } from 'src/entities/genre.entity';
import { UserType } from 'src/auth/user-type.decorator';
import GenreCreateDTO from 'src/genre/dtos/genre.create.dto';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('all')
  async adminGetsAllGenres(): Promise<Genre[]> {
    return await this.genreService.adminGetsAllGenres();
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('with-movies')
  async adminGetsAllGenresWithMovies(): Promise<Genre[]> {
    return this.genreService.adminGetsAllGenresWithMovies();
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('available')
  async adminGetsAvailableGenres(): Promise<Genre[]> {
    return await this.genreService.adminGetsAvailableGenres();
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('unavailable')
  async adminGetsUnavailableGenres(): Promise<Genre[]> {
    return await this.genreService.adminGetsUnavailableGenres();
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get(':id')
  async adminGetsOneGenre(@Param('id') id: number): Promise<Genre> {
    return await this.genreService.adminGetsOneGenre(id);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Post('create')
  async adminCreatesGenre(
    @Body() genreCreateDTO: GenreCreateDTO,
  ): Promise<Genre> {
    return await this.genreService.adminCreatesGenre(genreCreateDTO);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Post('enable/:id')
  async adminEnablesGenre(@Param('id') id: number): Promise<Genre> {
    return await this.genreService.adminEnablesGenre(id);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Delete('disable/:id')
  async adminDisablesGenre(@Param('id') id: number): Promise<Genre> {
    return await this.genreService.adminDisablesGenre(id);
  }
}
