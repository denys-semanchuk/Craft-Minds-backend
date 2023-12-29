import { ValidationPipe } from "@nestjs/common";
import { IsArray } from "class-validator";

export class CreateConversationDto extends ValidationPipe{

  @IsArray()
  public participantIds: number[]
}