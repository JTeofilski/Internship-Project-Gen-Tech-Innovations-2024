import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { UserTypeGuard } from 'src/auth/guards/user-type.guard';
import { UserType } from 'src/auth/user-type.decorator';
import { MovieScreening } from 'src/entities/movieScreening.entity';
import { UserTypeEnum } from 'src/enums/userType.enum';
import MovieScreeningCreateDTO from 'src/movie-screening/dtos/movie-screening.create.dto';
import MovieScreeningEditDTO from 'src/movie-screening/dtos/movie-screening.edit.dto';
import { MovieScreeningService } from 'src/movie-screening/movie-screening.service';

@ApiTags('MovieScreenings')
@Controller('movie-screening')
export class MovieScreeningController {
  constructor(private readonly movieScreeningService: MovieScreeningService) {}

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Post('create')
  async adminCreatesMovieScreening(
    @Body() movieScreeningDTO: MovieScreeningCreateDTO,
  ): Promise<MovieScreening> {
    return await this.movieScreeningService.adminCreatesMovieScreening(
      movieScreeningDTO,
    );
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Patch(':id')
  async adminEditsMovieScreening(
    @Param('id') id: number,
    @Body() movieScreeningDTO: MovieScreeningEditDTO,
  ): Promise<MovieScreening> {
    return await this.movieScreeningService.adminEditsMovieScreening(
      id,
      movieScreeningDTO,
    );
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('all')
  async getMovieScreenings(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<{ movieScreenings: MovieScreening[]; totalCount: number }> {
    return await this.movieScreeningService.getMovieScreenings(page, pageSize);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Delete('soft-delete/:id')
  async softDeleteMovieScreening(
    @Param('id') id: number,
  ): Promise<MovieScreening> {
    return await this.movieScreeningService.softDeleteMovieScreening(id);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Post('restore/:id')
  async restoreMovieScreening(@Param('id') id: number) {
    await this.movieScreeningService.restoreMovieScreening(id);
  }
}
