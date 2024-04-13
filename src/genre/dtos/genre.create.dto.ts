import { IsNotEmpty, IsString } from 'class-validator';

export default class GenreCreateDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
