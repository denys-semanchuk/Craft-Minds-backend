import { ValidationPipe } from "@nestjs/common";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto extends ValidationPipe {

  @IsString()
  @IsEmail()
  @ApiProperty()
  public email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword()
  @ApiProperty()
  public password: string;

}