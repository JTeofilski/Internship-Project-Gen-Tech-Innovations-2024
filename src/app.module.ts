import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from 'db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from 'utils/logger.middleware';
import { SeatModule } from './seat/seat.module';
import { MovieModule } from './movie/movie.module';
import { GenreModule } from './genre/genre.module';
import { AuditoriumModule } from './auditorium/auditorium.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MovieScreeningModule } from './movie-screening/movie-screening.module';
import { TicketModule } from './ticket/ticket.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      extra: {
        timezone: 'UTC',
        dateStrings: ['TIMESTAMP WITH TIME ZONE', 'DATETIME', 'DATE'],
        useUTC: true,
        skipUtcConversion: true,
      },
    }),
    SeatModule,
    MovieModule,
    GenreModule,
    AuditoriumModule,
    UserModule,
    AuthModule,
    MovieScreeningModule,
    TicketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
