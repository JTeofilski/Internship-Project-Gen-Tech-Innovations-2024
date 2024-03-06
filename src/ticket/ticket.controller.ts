import { Controller } from '@nestjs/common';
import { TicketService } from 'src/ticket/ticket.service';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}
}
