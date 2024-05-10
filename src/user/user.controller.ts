import { UserService } from './user.service';
import UserRegistrationDTO from 'src/user/dtos/user.registration.dto';
import { User } from 'src/entities/user.entity';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import UserUpdateDTO from 'src/user/dtos/user.update.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { UserTypeGuard } from 'src/auth/guards/user-type.guard';
import { ApiTags } from '@nestjs/swagger';
import ForgottenPasswordDTO from 'src/user/dtos/forgotten.password.dto';
import { ResetPasswordDTO } from 'src/user/dtos/reset.password.dto';
import { ChangePasswordDTO } from 'src/user/dtos/change.password.dto';

@ApiTags('Users')
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
    @Req() request,
  ): Promise<User> {
    return await this.userService.updateUser(id, userDTO, request.user.id);
  }

  @Post('forgotten-password')
  async forgottenPassword(
    @Body() forgottenPasswordDTO: ForgottenPasswordDTO,
  ): Promise<any> {
    return await this.userService.forgottenPassword(forgottenPasswordDTO.email);
  }

  @Post('reset-password/:id')
  async resetPassword(
    @Body() resetPasswordDTO: ResetPasswordDTO,
    @Param('id') id: number,
  ): Promise<any> {
    return await this.userService.resetPassword(
      resetPasswordDTO.resetCode,
      resetPasswordDTO.newPassword,
      id,
    );
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDTO: ChangePasswordDTO,
    @Req() request,
  ): Promise<any> {
    return await this.userService.changePassword(
      changePasswordDTO.newPassword,
      request.user.id,
    );
  }
}
