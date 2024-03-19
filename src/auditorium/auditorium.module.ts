import { Module } from '@nestjs/common';
import { AuditoriumService } from './auditorium.service';
import { AuditoriumController } from './auditorium.controller';
import { Auditorium } from 'src/entities/auditorium.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Auditorium])],
  controllers: [AuditoriumController],
  providers: [AuditoriumService],
  exports: [AuditoriumService],
})
export class AuditoriumModule {}
