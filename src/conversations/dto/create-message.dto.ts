import { IsNumber, IsString, MaxLength, MinLength, Validator } from "class-validator";

export class CreateMessageDto extends Validator {
  @IsNumber()
  public conversationId: number;

  @IsNumber()
  public userId: number;

  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  public content: string;
}