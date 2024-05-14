import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import LoginDTO from 'src/auth/dtos/login.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { UserTypeGuard } from 'src/auth/guards/user-type.guard';
import { UserType } from 'src/auth/user-type.decorator';
import { User } from 'src/entities/user.entity';
import { UserTypeEnum } from 'src/enums/userType.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // User is created on @Request object in LocalStrategy validate() method
  // LocalAuthGuard is used ONLY HERE
  // LocalAuthGuard is custom-made - check LocalAuthGuard to see the details
  // CHECK Passport.js DOCUMENTATION for more details
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() body: LoginDTO): Promise<User> {
    const res = req.user;
    return res;
  }

  @Post('logout')
  async logout(@Request() req) {
    req.logout(() => {});
    return { message: 'LOGOUT SUCCESSFUL' };
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
    //console.log('AUTH CONTROLLER: ', req.user);
    const res = req.user;
    return res;
  }
}
