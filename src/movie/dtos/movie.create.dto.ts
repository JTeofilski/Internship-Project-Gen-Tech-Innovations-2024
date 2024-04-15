import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export default class MovieCreateDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duration: number;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  genreIds: number[];
}
