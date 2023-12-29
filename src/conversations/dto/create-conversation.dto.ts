import { ValidationPipe } from "@nestjs/common";
import { IsArray, IsOptional, IsString } from "class-validator";
import { ConversationType } from "@prisma/client";

export class CreateConversationDto extends ValidationPipe {
  @IsArray()
  public participantIds: number[];

  @IsString()
  public conversationName: string;

  @IsString()
  @IsOptional()
  public conversationAvatar: string;

  @IsString()
  public type: ConversationType;
}