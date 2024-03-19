import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

export default class MovieScreeningCreateDTO {
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dateAndTime: Date;

  @IsNotEmpty()
  @IsInt()
  movieId: number;

  @IsNotEmpty()
  @IsInt()
  auditoriumId: number;
}
