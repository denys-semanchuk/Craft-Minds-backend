import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ConversationsService } from "./conversations.service";
import { AccessTokenGuard } from "../auth/guards";
import { Request } from "express";
import { CreateConversationDto } from "./dto/create-conversation.dto";

@Controller("api/chats")
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async getMyChats(@Req() req: Request) {
    const userId = req.user["sub"] as number;
    return this.conversationsService.getMyConversations(userId);
  }


  @Post()
  @UseGuards(AccessTokenGuard)
  async createConversation(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.createConversation(createConversationDto);
  }

  @Get(":id/messages")
  @UseGuards(AccessTokenGuard)
  async getMessages(@Req() req: Request, @Param() params: Parameters<any>) {
    const userId = req.user["sub"];
    const conversationId = Number(params["id"]);
    return this.conversationsService.getMessages({ userId, conversationId })
  }
}