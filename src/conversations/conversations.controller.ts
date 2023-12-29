import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ConversationsService } from "./conversations.service";
import { AccessTokenGuard } from "../auth/guards";
import { Request } from "express";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { CreateMessageDto } from "./dto/create-message.dto";

@Controller("api/chats")
@UseGuards(AccessTokenGuard)
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {
  }

  @Get()
  async getMyChats(@Req() req: Request) {
    const userId = req.user["sub"] as number;
    return this.conversationsService.getMyConversations(userId);
  }


  @Post()
  async createConversation(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.createConversation(createConversationDto);
  }

  @Get(":id")
  async findConversation(@Req() req: Request, @Param() params: Parameters<any>) {
    const conversationId = Number(params["id"]);
    const userId = req.user["sub"] as number;
    return this.conversationsService.findConversation(conversationId, userId);
  }

  @Get(":id/messages")
  async getMessages(@Req() req: Request, @Param() params: Parameters<any>) {
    const conversationId = Number(params["id"]);
    return this.conversationsService.getMessages({ conversationId });
  }

  @Post("messages")
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.conversationsService.createMessage(createMessageDto);
  }

}