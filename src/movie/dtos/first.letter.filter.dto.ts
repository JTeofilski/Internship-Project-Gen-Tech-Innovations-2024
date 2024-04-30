import { IsAlpha, Length } from 'class-validator';

export class FirtsLetterFilterDTO {
  @IsAlpha()
  @Length(1, 1, { message: 'Only single alphabetic character is allowed' })
  letter: string;
}
