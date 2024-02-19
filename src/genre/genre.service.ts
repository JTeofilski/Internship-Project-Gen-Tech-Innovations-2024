import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from 'src/entities/genre.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre)
        private readonly genreRepository: Repository<Genre>,
    ) { }
}
