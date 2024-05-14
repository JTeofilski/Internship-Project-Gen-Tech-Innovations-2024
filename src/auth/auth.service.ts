import { Injectable } from '@nestjs/common';
import LoginDTO from 'src/auth/dtos/login.dto';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(loginDTO: LoginDTO): Promise<User> {
    const user = await this.userService.findOneByEmail(loginDTO.email);
    //console.log('auth service');

    if (user && (await user.comparePassword(loginDTO.password))) {
      return user;
    } else {
      return null;
    }
  }
}
