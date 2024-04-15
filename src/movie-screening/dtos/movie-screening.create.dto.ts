import { IsInt, IsNotEmpty, Matches, Max, Min } from 'class-validator';

export default class MovieScreeningCreateDTO {
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, {
    message: 'Date and time must be in the format YYYY-MM-DDTHH:mm:ssZ',
  })
  dateAndTime: Date;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  movieId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  auditoriumId: number;
}
