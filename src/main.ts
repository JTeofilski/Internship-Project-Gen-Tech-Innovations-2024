import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'cookie-session';
import * as passport from 'passport';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('CLA')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

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

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(process.env.APP_PORT);
}
bootstrap();
