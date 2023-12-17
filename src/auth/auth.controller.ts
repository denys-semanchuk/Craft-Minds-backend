import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { Response, Request } from "express";
import { LoginDto } from "./dto/login.dto";
import { AccessTokenGuard, RefreshTokenGuard } from "./guards";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post("register")
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.register(registerDto, res);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

  @UseGuards(AccessTokenGuard)
  @Get("logout")
  async logout(@Req() req: Request) {
    return this.authService.logout(req.user["email"]);
  }

  @UseGuards(RefreshTokenGuard)
  @Get("refresh")
  refreshTokens(@Req() req: Request, @Res() res: Response) {
    const userId = req.user["sub"];
    const refreshToken = req.user["refreshToken"];

    return this.authService.refreshToken(userId, refreshToken, res);
  }

}
