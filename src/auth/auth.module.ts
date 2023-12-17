import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AccessTokenStrategy, RefreshTokenStrategy } from "./strategies";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenGuard } from "./guards";

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, AccessTokenGuard],
  controllers: [AuthController],
  exports: [AccessTokenGuard]
})
export class AuthModule {
}
