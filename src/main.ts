import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'cookie-session';
import * as passport from 'passport';
import 'dotenv/config';
import { ClassSerializerInterceptor } from '@nestjs/common';
import * as fs from 'fs';
import { DTO_Schemas } from 'dto-schemas';
import { globalValidationPipe } from 'validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('CLA')
    .addServer('http://localhost:3000')
    .addCookieAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  document.components.schemas = DTO_Schemas;

  SwaggerModule.setup('/api/docs', app, document);

  fs.writeFile('docs/swagger.json', JSON.stringify(document), () => {
    //console.log('Swagger document generated in docs/swagger.json');
  });

  // HTTP i HTTPS razlika je u tome sto HTTPS podrzava enkripciju, dok HTTP nema nikakvu enkripciju
  // HTTPS je sigurna(S stands for Secure) verzija HTTP-a

  // keys deo - znaci da server pomocu tog key-a formira kolacic, npr. kolacic = info.o sesiji + key, i posalje ga klijentu, klijent onda salje nazad taj combo, pri sledecem zahtevu, i server proverava da li se key poklapa sa ovim definisanim - drugim recima, server proverava ko je kreirao taj kolacic(a trebalo bi da je bas sam server)
  // secure: true, znacilo bi da je podrzan samo HTTPS, kod nas je slucaj da su podrzani i HTTP i HTTPS protokoli, podrzani u smislu slanja, salje se preko tog i tog protokola
  // httpOnly: true - ovo prakticno znaci, da browser(dalje imenovan kao JavaScript) iako cuva i salje kolacice, ne moze da ih cita ili menja
  // Najbolja opcija bi bila staviti i secure: true i httpOnly: true
  // signed: true, ide u kombinaciji sa keys delom, sa signed: true se naglasava da kolacici hoce biti potpisani, a pomocu cega, pa keys dela

  app.use(
    session({
      keys: [process.env.SECRET], // Checks if server created certain cookie
      maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
      secure: false, // Both, HTTP and HTTPS are allowed
      httpOnly: true, // If set to true, it prevents client-side scripts from accessing this cookie, which can help protect against cross-site scripting attacks.
      signed: true, // Cookies are signed with certain key
    }),
  );

  // without this my Passport wasn't able to work with cookie-session
  // error: "...regenerate is not a function..."
  // switching to cookie-session instead of express-session, meant just to add 2 app.use()s,
  // this one and the one above with session configuration

  // Ovo je middleware funkcija, a to je funkcija koja se izvrsava izmedju zahteva i odgovora
  // Radimo sa zahtevima i odgovorima(request, response) i sa funkcijom next()
  // next() omogucava da se predje na sledeci korak u obradi zahteva
  // Ovde se za sesiju koja postoji proverava da li ima metode: regenerate() i save()
  // regenerate tacno znaci da se radi osvezavanje identifikatora sesije(nasumican niz brojeva), a taj identifikator sesije browser dobija od servera, i vazno je da on bude tacan
  // save je bitna opcija(seti se Word dokumenta, sesija je kao dokument), mora da postoji mehanizam za cuvanje promena i to se ovde obezbedjuje
  app.use(function (request, response, next) {
    if (request.session && !request.session.regenerate) {
      request.session.regenerate = (cb) => {
        cb();
      };
    }
    if (request.session && !request.session.save) {
      request.session.save = (cb) => {
        cb();
      };
    }
    next();
  });

  // Passport mora da se inicijalizu da bi sve radilo
  // Mislim na Guard-ove, pre svega
  app.use(passport.initialize());
  app.use(passport.session());

  // Seti se DTO objekata, tamo se koristi class-validator, on i ovaj deo koda saradjuju, sto ima smisla
  // Vazno je napomenuti da class-validator moze da radi i samostalno, ali ovo je preporucena praksa
  // Poenta svega ovoga je provera podataka pre nego sto dodju do kontrolera
  app.useGlobalPipes(globalValidationPipe);

  // Ovo se koristi kako bi se omogućilo čitanje dekoratora @Expose
  // Napravila sam test i zakomentarisala ovu liniju i pozvala endpoint koji koji gadja entitet gde imam virtuelno polje(Seat) i zaista ne radi - ne baca gresku, ali ne pokazuje vrednost za virt.polje
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.APP_PORT);
}
bootstrap();
