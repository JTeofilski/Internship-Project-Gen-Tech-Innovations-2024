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
    console.log('Swagger document generated in docs/swagger.json');
  });

  app.use(
    session({
      keys: [process.env.SECRET],
      maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
      secure: false, // For HTTPS
      httpOnly: true,
      signed: true, // Cookies are signed
    }),
  );

  // without this my Passport wasn't able to work with cookie-session
  // error: "...regenerate is not a function..."
  // switching to cookie-session instead of express-session, meant just to add 2 app.use()s,
  // this one and the one above with session configuration
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

  app.useGlobalPipes(globalValidationPipe);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.APP_PORT);
}
bootstrap();
