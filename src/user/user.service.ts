import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

import UserRegistrationDTO from 'src/user/dtos/user.registration.dto';
import { UserSubscriber } from 'src/user/subscribers/user.subscriber';
import { Repository } from 'typeorm';
import UserUpdateDTO from 'src/user/dtos/user.update.dto';

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
}
