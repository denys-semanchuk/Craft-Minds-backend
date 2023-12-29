import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ConversationsService } from "./conversations.service";
import { AccessTokenGuard } from "../auth/guards";
import { Request } from "express";

@Controller("api/chats")
export class ConversationsController {
  constructor(private chatsService: ConversationsService) {
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async getMyChats(@Req() req: Request) {
    const userId = req.user["sub"] as number;
    return this.chatsService.getMyConversations(userId);
  }


  @Post()
  @UseGuards(AccessTokenGuard)
  async createConversation() {
  }
}