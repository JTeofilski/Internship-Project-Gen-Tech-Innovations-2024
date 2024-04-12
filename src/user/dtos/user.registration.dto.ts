import { IsNotEmpty, IsString } from 'class-validator';

export default class UserRegistrationDTO {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
