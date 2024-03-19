import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsOptional } from 'class-validator';
import { MovieScreeningTypeEnum } from 'src/enums/movieScreeningType.enum';

export default class MovieScreeningEditDTO {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  dateAndTime?: Date;

  @IsOptional()
  @IsBoolean()
  status?: MovieScreeningTypeEnum;

  @IsOptional()
  @IsInt()
  movieId?: number;

  @IsOptional()
  @IsInt()
  auditoriumId?: number;
}
