import { IsAlpha, IsNotEmpty, Length } from 'class-validator';

export class FirtsLetterFilterDTO {
  @IsNotEmpty()
  @IsAlpha()
  @Length(1, 1, { message: 'Only SINGLE character is allowed' })
  letter: string;
}
