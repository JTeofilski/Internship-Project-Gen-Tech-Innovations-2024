import { IsNotEmpty, IsString } from 'class-validator';

export default class ForgottenPasswordDTO {
  @IsNotEmpty()
  @IsString()
  email: string;
}
