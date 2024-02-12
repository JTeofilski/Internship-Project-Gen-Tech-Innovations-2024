import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from 'src/entities/seat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeatService {
    constructor(
        @InjectRepository(Seat)
        private readonly seatRepository: Repository<Seat>,
    ) { }




}
