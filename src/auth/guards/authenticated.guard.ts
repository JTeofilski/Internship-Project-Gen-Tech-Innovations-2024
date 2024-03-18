import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.isAuthenticated())
      throw new ForbiddenException(
        'MY FORBIDDEN EXCEPTION FROM AUTHENTICATED_GUARD',
      );
    return true;
  }
}

// Implementira CanActivate interfejs
// Sluzi tome da,  samo AUTENTIFIKOVANI(pronadjeni u bazi) korisnici imaju pristup ruti iznad koje je ovaj Guard
// canActivate sa context-om, poziva se za svaki zahtev ka ruti iznad koje je ovaj Guard
// u request delu se izvuce sam zahtev
// sledece, isAuthenticated() je metod vezan za Passport, ne za sam interfejs - CanActivate
// CanActivate interfejs ima samo jednu metodu - canActivate!!!
// isAuthenticated() se obicno koristi nad request objektom
