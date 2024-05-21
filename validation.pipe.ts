import { ValidationPipe } from '@nestjs/common';

export const globalValidationPipe = new ValidationPipe({
  // znaci da se radi konverzija ulaznih podataka u odgovorajuc tip pre validacije
  transform: true,
  // Samo eksplicitno navedena polja u DTO klasi se uzimaju u obzir, ostala se ignorisu
  whitelist: true,
  // Ova opcija radi u saradnji sa whitelist: true, i kaze da sva polja koja su visak, ne samo da se ignorisu, vec se zabranjuju
  forbidNonWhitelisted: true,
});
