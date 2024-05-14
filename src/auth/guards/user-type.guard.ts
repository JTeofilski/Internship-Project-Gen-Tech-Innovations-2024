import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserTypeEnum } from 'src/enums/userType.enum';

// Nasledjueje se CanActivate interfejs koji ima samo jednu metodu canActivate koja se ovde override-uje
// U konstruktoru se uvodi na koriscenje nesto novo, a to je reflector: Reflector
// On sluzi za dobavljanje meta-podataka, a mesto gde su meta podaci je UserType custom dekorator
@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Prvi argument ovog get-a je kljuc pod kojim su meta-podaci postavljeni
    // Drugi argument nije najjasniji, ali to bi trebalo da je funkcija koja se trenutno izvrsava, ona koja je u pitanju(neki endpoint iznad koga je ovo)
    const requiredType = this.reflector.get<UserTypeEnum>(
      'userType',
      context.getHandler(),
    );

    // ako nije naveden tip u okviru @UserType dekoratora, onda se dozvoljava pristup svim korisnicima
    if (!requiredType) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Ako korisnik nije autentifikovan ili nema odgovarajući tip, zabrani pristup
    if (!user || user.userType !== requiredType) {
      throw new ForbiddenException(
        'MY FORBIDDEN EXCEPTION FROM USER_TYPE_GUARD',
      );
    }

    // Ako je korisnik autentifikovan i ima odgovarajući tip, dozvoli pristup
    return true;
  }
}
