import { UserService } from './user.service';
import UserRegistrationDTO from 'src/user/dtos/user.registration.dto';
import { User } from 'src/entities/user.entity';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import UserUpdateDTO from 'src/user/dtos/user.update.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { UserTypeGuard } from 'src/auth/guards/user-type.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registration')
  async registerUser(@Body() userDTO: UserRegistrationDTO): Promise<User> {
    return await this.userService.registerUser(userDTO);
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() userDTO: UserUpdateDTO,
  ): Promise<User> {
    return await this.userService.updateUser(id, userDTO);
  }
}
