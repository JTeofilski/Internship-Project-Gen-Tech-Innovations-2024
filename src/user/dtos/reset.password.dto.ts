import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsString()
  resetCode: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
