import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

import UserRegistrationDTO from 'src/user/dtos/user.registration.dto';
import { UserSubscriber } from 'src/user/subscribers/user.subscriber';
import { Repository } from 'typeorm';
import UserUpdateDTO from 'src/user/dtos/user.update.dto';
import { EmailService } from 'email/email.service';
import { use } from 'passport';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userSubscriber: UserSubscriber,
    private emailService: EmailService,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async registerUser(userDTO: UserRegistrationDTO): Promise<User> {
    const existingUser = await this.findOneByEmail(userDTO.email);

    if (existingUser) {
      throw new ConflictException('ACCOUNT WITH PROVIDED EMAIL ALREADY EXISTS');
    }

    const user = await this.userRepository.save(
      this.userRepository.create(userDTO),
    );

    return user;
  }

  async findOneById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateUser(
    id: number,
    userDTO: UserUpdateDTO,
    userFromRequestId: number,
  ): Promise<User> {
    const user = await this.findOneById(id);

    if (!user) {
      throw new ForbiddenException('USER NOT FOUND');
    }

    if (!(id === user.id && userFromRequestId === user.id)) {
      throw new ForbiddenException('NOT AUTHORIZED TO UPDATE THIS USER');
    }

    Object.assign(user, userDTO);
    await this.userRepository.save(user);

    return user;
  }

  async forgottenPassword(email: string): Promise<any> {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(
        `USER WITH PROVIDED EMAIL: ${email} NOT FOUND`,
      );
    }
    const resetCode = this.generateResetCode();
    console.log('RESET CODE:');
    console.log(resetCode);

    user.resetCode = resetCode;
    await this.userRepository.save(user);

    const subject = 'Reset Code';
    const message = `Reset Code: ${resetCode}`;
    return await this.emailService.sendEmail(email, subject, message);
  }

  async resetPassword(
    resetCode: string,
    newPassword: string,
    userId: number,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId, resetCode: resetCode },
    });

    if (!user) {
      throw new NotFoundException('RESET CODE: WRONG');
    }

    user.password = newPassword;
    await this.userRepository.save(user);

    const subject = 'Password Reset Successful';
    const message = 'Your password has been successfully reset.';
    return await this.emailService.sendEmail(user.email, subject, message);
  }

  private generateResetCode(): string {
    const codeLength = 4;
    const min = Math.pow(10, codeLength - 1);
    const max = Math.pow(10, codeLength) - 1;
    const resetCode = Math.floor(Math.random() * (max - min + 1)) + min;
    return resetCode.toString();
  }
}
