import { IsNotEmpty, IsString } from 'class-validator';

export default class LoginDTO {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
