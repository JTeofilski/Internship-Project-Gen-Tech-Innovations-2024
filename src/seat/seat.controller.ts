import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SeatService } from './seat.service';
import { Seat } from 'src/entities/seat.entity';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { UserTypeGuard } from 'src/auth/guards/user-type.guard';
import { UserType } from 'src/auth/user-type.decorator';
import { UserTypeEnum } from 'src/enums/userType.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Seats')
@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.CUSTOMER)
  @Get(':id')
  async getSeats(@Param('id') id: number): Promise<Seat[]> {
    return await this.seatService.getSeats(id);
  }
}
