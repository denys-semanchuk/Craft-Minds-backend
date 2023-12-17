import { ValidationPipe } from "@nestjs/common";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength
} from "class-validator";

export class LoginDto extends ValidationPipe {

  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword()
  public password: string;

}