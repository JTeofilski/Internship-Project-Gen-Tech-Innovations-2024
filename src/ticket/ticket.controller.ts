import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { UserTypeGuard } from 'src/auth/guards/user-type.guard';
import { UserType } from 'src/auth/user-type.decorator';
import { Ticket } from 'src/entities/ticket.entity';
import { UserTypeEnum } from 'src/enums/userType.enum';
import TicketsBuyingDTO from 'src/ticket/dtos/tickets.buying.dto';
import { TicketService } from 'src/ticket/ticket.service';

@ApiTags('Tickets')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.CUSTOMER)
  @Post('buy-tickets')
  async buyTickets(
    @Body() ticketsBuyingDTO: TicketsBuyingDTO,
    @Req() request,
  ): Promise<Ticket[]> {
    return await this.ticketService.buyTickets(
      ticketsBuyingDTO.movieScreeningId,
      ticketsBuyingDTO.seatIds,
      request.user.id,
    );
  }
}
