import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon from "argon2";
import { Response } from "express";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {
  }

  async register(registerDto: RegisterDto, res: Response): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: registerDto.email }
    });

    if (user) throw new BadRequestException("User already exists");

    const hash = await argon.hash(registerDto.password);
    delete registerDto.password;
    const newUser = await this.prisma.user.create({
      data: {
        ...registerDto,
        hash,
        refreshToken: ""
      }
    });
    const tokens = await this.getTokens(newUser.id, newUser.email);

    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    await this.attachTokenCookie("refresh_token", tokens.refreshToken, res);

    return { access_token: tokens.accessToken };
  }

  async login(loginDto: LoginDto, res: Response): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email }
    });

    if (!user) {
      throw new BadRequestException(`There's no user with email: ${loginDto.email}`);
    }

    const pwMatches = await argon.verify(user.hash, loginDto.password);

    if (!pwMatches) {
      throw new BadRequestException(`Invalid credentials`);
    }

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    await this.attachTokenCookie("refresh_token", tokens.refreshToken, res);

    return { access_token: tokens.accessToken };
  }

  async logout(userId: number) {
    this.prisma.user.update({ where: { id: userId }, data: { refreshToken: "" } });
  }


  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    return this.prisma.user.update({ where: { id: userId }, data: { refreshToken: hashedRefreshToken } });
  }


  attachTokenCookie(key: string, value: string, res: Response) {
    return res.cookie(key, value, {
      httpOnly: true,
      signed: true,
      secure: true
    });
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          email
        },
        {
          secret: this.config.get<string>("JWT_ACCESS_SECRET"),
          expiresIn: "15m"
        }
      ),
      this.jwt.signAsync(
        {
          sub: userId,
          email
        },
        {
          secret: this.config.get<string>("JWT_REFRESH_SECRET"),
          expiresIn: "7d"
        }
      )
    ]);

    return {
      accessToken,
      refreshToken
    };
  }

  async refreshToken(userId: number, refreshToken: string, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user || !user.refreshToken)
      throw new ForbiddenException("Access denied");

    const refreshTokenMatches = await argon.verify(user.refreshToken, refreshToken);
    console.log(user.refreshToken, refreshToken);
    if (!refreshTokenMatches)
      throw new ForbiddenException("Access denied");
    const tokens = await this.getTokens(userId, user.email);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    res.cookie('refresh_cookie', refreshToken, {
      signed:true,
      secure:true,
    })
    return { access_token: tokens.accessToken };
  }

}