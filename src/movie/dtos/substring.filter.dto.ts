import { IsAlpha, IsNotEmpty, Min, isNotEmpty } from 'class-validator';

export class SubstringFilterDTO {
  @IsNotEmpty()
  @IsAlpha()
  word: string;
}
