import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auditorium } from 'src/entities/auditorium.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuditoriumService {
    constructor(
        @InjectRepository(Auditorium)
        private readonly auditoriumRepository: Repository<Auditorium>,
    ) { }
}
