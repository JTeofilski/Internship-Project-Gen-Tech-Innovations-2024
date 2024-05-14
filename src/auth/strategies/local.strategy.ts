import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  // Dodatne opcije se podesavaju ovde u konstruktoru
  // Nase dodatno podesavanje je drugacije
  // Umesto username-a i password-a koji su karakteristicni za local-strategy
  // Mi koristimo email i password, sto je podeseno u super()
  constructor(private readonly authService: AuthService) {
    // Konstruktor roditeljske klase je super()
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  // Svaka strategija ima svoju validate metodu kod nas je u pitanju LOCAL strategija
  // USER is returned so Passport can complete its tasks - creating the user property on the Request object
  // CREATING USER ON THE REQUEST OBJECT!!!!!
  async validate(email: string, password: string): Promise<any> {
    //console.log('local strategy');
    const user = await this.authService.validateUser({ email, password });
    if (!user) {
      throw new NotFoundException(
        'MY NOT_FOUND EXCEPTION FROM LOCAL_STRATEGY: WRONG CREDENTIALS',
      );
    } else {
      return user;
    }
  }
}
