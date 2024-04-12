import { IsEnum, IsInt, IsOptional, Matches, Max, Min } from 'class-validator';
import { MovieScreeningTypeEnum } from 'src/enums/movieScreeningType.enum';

export default class MovieScreeningEditDTO {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, {
    message: 'Date and time must be in the format YYYY-MM-DDTHH:mm:ssZ',
  })
  dateAndTime?: Date;

  @IsOptional()
  @IsEnum(MovieScreeningTypeEnum)
  status?: MovieScreeningTypeEnum;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  movieId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  auditoriumId?: number;
}
