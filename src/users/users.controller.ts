import { Controller, Get, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "../auth/guards";

@Controller("users")
export class UsersController {
  constructor() {
  }

  @Get("me")
  @UseGuards(AccessTokenGuard)
  async getUsersProfile() {
    console.log("Hiiii");
    return "Denys"
  }
}
