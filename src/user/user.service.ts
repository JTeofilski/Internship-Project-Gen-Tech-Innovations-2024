import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

import UserRegistrationDTO from 'src/user/dtos/user.registration.dto';
import { UserSubscriber } from 'src/user/subscribers/user.subscriber';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userSubscriber: UserSubscriber,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async registerUser(userDTO: UserRegistrationDTO): Promise<User> {
    const existingUser = await this.findOneByEmail(userDTO.email);

    if (existingUser) {
      throw new ConflictException('ACCOUNT WITH PROVIDED EMAIL ALREADY EXISTS');
    }

    return await this.userRepository.save(this.userRepository.create(userDTO));
  }
}
