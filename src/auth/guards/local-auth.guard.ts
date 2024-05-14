import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnprocessableEntityException } from '@nestjs/common';

// AuthGuard je kombinacija CanActivate interfejsa i dodatnih metoda poput logIn metode koju mi konkretno koristimo
// CanActivate je interfejs koji ima samo jednu metodu - canActivate ciji je zadatak da proceni da li da se nastavi sa zahtevom ili ne
// Dodatne metode se vide kad se ode na implementaciju AuthGuard-a
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  // context - Predstavlja kontekst izvršenja u NestJS aplikaciji
  // Kroz context mozemo pristupiti zahtevu(request) koji nama i treba

  // Svaki Guard mora da ima canActivate metodu
  // canActivate metoda prima gore objasnjen kontekst
  // canActivate metoda vraca boolean
  async canActivate(context: ExecutionContext) {
    try {
      // super() znaci da se poziva konstruktor roditeljske klase, sto je kod nas AuthGuard koji je kombinacija: CanACtivate interfejs + dodatne metode(kao logIn)
      // Kada se klikne na canActivate metod, otvara se CanActivate interfejs(koji samo tu metodu i ima)
      // Poenta koda koji sledi jeste da se odluci da li se nastavlja sa obradom zahteva ili ne
      // U tu svrhu postoji result
      // Ako je result = true, nastavlja se sa obradom zahteva
      // Ako je result = false, baca se exception i izlazi se iz funkcije

      // Za sada nisam uspela da izazovem da se desi ovaj exception(probala sam sa pogresnim kredencijalima i bez kredencijala - nije radilo)
      // Mozda nisam uspela da izazovem exception zato sto context uvek postoji pa canActivate vraca true?(i za ispravne i neispravne zahteve)

      //console.log('local auth guard');
      const result = await super.canActivate(context);

      if (!result) {
        throw new UnprocessableEntityException(
          'VALIDATION FROM LocalAuthGuard FAILEDDDD',
        );
      }
      // Sad se iz konteksta uzima zahtev i nad njim se primenjuje metoda logIn iz AuthGuard-a
      // Ako se unesu pogresni kredencijali, ili bez kredencijala, dobija se exception
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
