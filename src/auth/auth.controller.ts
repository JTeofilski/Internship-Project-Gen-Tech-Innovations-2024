import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import LoginDTO from 'src/auth/dtos/login.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { UserTypeGuard } from 'src/auth/guards/user-type.guard';
import { UserType } from 'src/auth/user-type.decorator';
import { User } from 'src/entities/user.entity';
import { UserTypeEnum } from 'src/enums/userType.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() body: LoginDTO): Promise<User> {
    const res = req.user;
    return res;
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @Get('/protected')
  getAvailableForBothTypes(@Request() req): Promise<User> {
    const res = req.user;
    return res;
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.ADMIN)
  @Get('/admin')
  getAvailableForAdmin(@Request() req): Promise<User> {
    const res = req.user;
    return res;
  }

  @UseGuards(AuthenticatedGuard, UserTypeGuard)
  @UserType(UserTypeEnum.CUSTOMER)
  @Get('/customer')
  getAvailableForCustomer(@Request() req): Promise<User> {
    const res = req.user;
    return res;
  }
}
