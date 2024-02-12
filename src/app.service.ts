import { Injectable } from '@nestjs/common';
import { Seat } from './entities/seat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }

  /*getBool(): boolean {
    console.log("Ovo je test")
    return true;
  }*/






}
