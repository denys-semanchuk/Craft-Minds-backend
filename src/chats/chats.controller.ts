import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { AccessTokenGuard } from "../auth/guards";
import { Request } from "express";

@Controller("api/chats")
export class ChatsController {
  constructor(private chatsService: ChatsService) {
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async getMyChats(@Req() req: Request) {
    const userId = req.user["sub"] as number;
    const chats = await this.chatsService.getMyChats(userId);
    return chats;
  }
}