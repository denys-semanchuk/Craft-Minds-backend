import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_REFRESH_SECRET"),
      passReqToCallback: true
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.signedCookies.get("refresh_token");

    req.headers["Authorization"] = refreshToken;

    return { ...payload, refreshToken };
  }
}