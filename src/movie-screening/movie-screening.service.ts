import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieScreening } from 'src/entities/movieScreening.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MovieScreeningService {
  constructor(
    @InjectRepository(MovieScreening)
    private readonly movieScreeningRepository: Repository<MovieScreening>,
  ) {}
}
