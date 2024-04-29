import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { UserTypeGuard } from 'src/auth/guards/user-type.guard';
import { UserType } from 'src/auth/user-type.decorator';
import { Ticket } from 'src/entities/ticket.entity';
import { UserTypeEnum } from 'src/enums/userType.enum';
import TicketsBuyingOrReservationDTO from 'src/ticket/dtos/tickets.reservation.or.buying.dto';
import { TicketService } from 'src/ticket/ticket.service';

@ApiTags('Tickets')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.CUSTOMER)
  @Post(':action')
  async buyOrReserveTickets(
    @Body() ticketsBuyingOrReservationDTO: TicketsBuyingOrReservationDTO,
    @Req() request,
    @Param('action') actionType: 'buy' | 'reserve',
  ): Promise<Ticket[]> {
    return await this.ticketService.buyOrReserveTickets(
      actionType,
      ticketsBuyingOrReservationDTO.movieScreeningId,
      ticketsBuyingOrReservationDTO.seatIds,
      request.user.id,
    );
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.CUSTOMER)
  @Delete('cancel/:id')
  async cancelReservation(
    @Param('id') id: number,
    @Req() request,
  ): Promise<any> {
    return await this.ticketService.cancelReservation(id, request.user.id);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.CUSTOMER)
  @Get('total-price/:id')
  async getTotalPrice(@Param('id') id: number, @Req() request): Promise<any> {
    return this.ticketService.getTotalPrice(id, request.user.id);
  }
}
