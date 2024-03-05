import { IsOptional, IsString } from 'class-validator';

export default class UserUpdateDTO {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
