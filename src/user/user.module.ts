import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscriber } from 'src/user/subscribers/user.subscriber';
import { EmailService } from 'email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserSubscriber, EmailService],
  exports: [UserService],
})
export class UserModule {}
