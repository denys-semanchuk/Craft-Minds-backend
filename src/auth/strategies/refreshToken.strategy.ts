import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([RefreshTokenStrategy.extractJWT, ExtractJwt.fromAuthHeaderAsBearerToken()]),
      ignoreExpiration: false,
      secretOrKey: config.get("JWT_REFRESH_SECRET")
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.signedCookies &&
      "refresh_token" in req.signedCookies &&
      req.signedCookies.refresh_token.length > 0
    ) {
      return req.signedCookies.refresh_token;
    }
    return null;
  }

  validate(payload: any) {
    return payload
  }
}