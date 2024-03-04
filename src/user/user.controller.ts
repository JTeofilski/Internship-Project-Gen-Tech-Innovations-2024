import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import UserRegistrationDTO from 'src/user/dtos/user.registration.dto';
import { User } from 'src/entities/user.entity';
import { UserTypeEnum } from 'src/enums/userType.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registration')
  async registerUser(@Body() userDTO: UserRegistrationDTO): Promise<User> {
    return await this.userService.registerUser(userDTO);
  }
}
