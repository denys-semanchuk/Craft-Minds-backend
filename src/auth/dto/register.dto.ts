import { ValidationPipe } from "@nestjs/common";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
  MinLength
} from "class-validator";

export class RegisterDto extends ValidationPipe {
  @IsString()
  @MinLength(2)
  @Length(2, 50)
  public firstName: string;

  @IsString()
  @MinLength(2)
  @Length(2, 50)
  public lastName: string;

  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword()
  public password: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  public bio: string;

}