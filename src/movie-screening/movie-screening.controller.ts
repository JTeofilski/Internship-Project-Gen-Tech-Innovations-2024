import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { UserTypeGuard } from 'src/auth/guards/user-type.guard';
import { UserType } from 'src/auth/user-type.decorator';
import { MovieScreening } from 'src/entities/movieScreening.entity';
import { UserTypeEnum } from 'src/enums/userType.enum';
import MovieScreeningCreateDTO from 'src/movie-screening/dtos/movie-screening.create.dto';
import MovieScreeningEditDTO from 'src/movie-screening/dtos/movie-screening.edit.dto';
import { MovieScreeningService } from 'src/movie-screening/movie-screening.service';

@Controller('movie-screening')
export class MovieScreeningController {
  constructor(private readonly movieScreeningService: MovieScreeningService) {}

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Post('create-ms')
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
  @Get('get-ms')
  async adminGetsMovieScreenings(): Promise<MovieScreening[]> {
    return await this.movieScreeningService.adminGetsMovieScreenings();
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Delete(':id')
  async adminDeletesMovieScreening(
    @Param('id') id: number,
  ): Promise<MovieScreening> {
    return await this.movieScreeningService.adminDeletesMovieScreening(id);
  }
}
