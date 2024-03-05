import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserTypeEnum } from 'src/enums/userType.enum';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // reflector se koristi za dobavljanje meta podataka
    // a mesto gde su meta podaci je @UserType dekorator
    // znaci, ovo se radi za slucaj da imamo i zelimo da koristimo rucno pravljeni dekorator
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
