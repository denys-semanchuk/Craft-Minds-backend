import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon from "argon2";
import { Response } from "express";
import { LoginDto } from "./dto/login.dto";
import { User } from "@prisma/client";

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
        hash
      }
    });
    const tokens = await this.getTokens(newUser);

    this.attachTokenCookie("refresh_token", tokens.refreshToken, res);

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

    const tokens = await this.getTokens(user);


    this.attachTokenCookie("refresh_token", tokens.refreshToken, res);

    return { access_token: tokens.accessToken };
  }


  attachTokenCookie(key: string, value: string, res: Response) {
    return res.cookie(key, value, {
      httpOnly: true,
      signed: true
    });
  }

  async getTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        {
          secret: this.config.get<string>("JWT_ACCESS_SECRET"),
          expiresIn: "10h"
        }
      ),
      this.jwt.signAsync(
        {
          sub: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        {
          secret: this.config.get<string>("JWT_REFRESH_SECRET"),
          expiresIn: "30d"
        }
      )
    ]);

    return {
      accessToken,
      refreshToken
    };
  }

  async refreshToken(userId: number, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user)
      throw new ForbiddenException("Access denied");

    const tokens = await this.getTokens(user);
    this.attachTokenCookie("refresh_token", tokens.refreshToken, res);
    return { access_token: tokens.accessToken };
  }

}