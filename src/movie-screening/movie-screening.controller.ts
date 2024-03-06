import { Controller } from '@nestjs/common';
import { MovieScreeningService } from 'src/movie-screening/movie-screening.service';

@Controller('movie-screening')
export class MovieScreeningController {
  constructor(private readonly movieScreeningService: MovieScreeningService) {}
}
