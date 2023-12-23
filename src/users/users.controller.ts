import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "../auth/guards";
import { UsersService } from "./users.service";
import {Request} from 'express'
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {
  }

  @Get("me")
  @UseGuards(AccessTokenGuard)
  async getMyProfile(@Req() req: Request) {
    const userId = req.user['sub']
    return this.usersService.getMyProfile(userId)
  }
}
