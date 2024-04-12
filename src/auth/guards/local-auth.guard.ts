/*import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
}*/

// Nasledjuje se ugradjena klasa AuthLocal, koja koristi strategiju koju smo modifikovali(iz Passporta)
// canActivate metod, vezan za GUARD, poziva se za svaki zahtev koji ide na rutu iznad koje je ovaj guard
// super.canActivate, poziva se ugradjena canActivate metoda, iz AuthGuard-a koja prima kontekst
// u kontekstu informacije o trenutnom zahtevu, odgovoru, ruti...
// sledece se, bas se hvata zahtev iz konteksta
// logIn, isto ugradjena metoda AuthGuard-a, sluzi za rucno postavljanje autentifikacije nakon uspesne provere
// result, vraca se boolean, ako je true - zahtev odobren, i obrnuto

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    try {
      const result = await super.canActivate(context);
      if (!result) {
        throw new UnprocessableEntityException(
          'VALIDATION FROM LocalAuthGuard FAILED',
        );
      }
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);
      return true;
    } catch (error) {
      throw new UnprocessableEntityException(
        'VALIDATION FROM LocalAuthGuard FAILED',
      );
    }
  }
}
