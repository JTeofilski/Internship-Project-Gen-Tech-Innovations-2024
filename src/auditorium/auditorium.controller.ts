import { Controller } from '@nestjs/common';
import { AuditoriumService } from './auditorium.service';

@Controller('auditorium')
export class AuditoriumController {
  constructor(private readonly auditoriumService: AuditoriumService) {}
}
