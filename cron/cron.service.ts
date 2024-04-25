import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TicketService } from 'src/ticket/ticket.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  private isRunning = false; // Indikator da li se cron posao trenutno izvršava

  constructor(private readonly ticketService: TicketService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredReservations() {
    if (this.isRunning) {
      return;
    }

    try {
      this.isRunning = true;
      this.logger.log('Starting cron job to cancel expired reservations...');

      for (let countdown = 60; countdown > 0; countdown--) {
        this.logger.log(`Countdown: ${countdown} seconds`);
        await this.delay(1000);
      }

      await this.ticketService.deleteExpiredReservations();

      this.logger.log('Cron job finished canceling expired reservations.');
    } catch (error) {
      this.logger.error(
        `Error while processing expired reservations: ${error.message}`,
      );
    } finally {
      this.isRunning = false;
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
