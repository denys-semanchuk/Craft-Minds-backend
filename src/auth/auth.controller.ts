import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto";
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
  async logout(@Req() req: Request, @Res() res: Response) {
    res.cookie("refresh_token", "");
  }

  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userId = req.user["sub"];
    return this.authService.refreshToken(userId, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Get("check")
  async checkAuth(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userId = req.user["sub"];
    const { access_token } = await this.authService.refreshToken(userId, res);
    return { access_token };
  }
}
