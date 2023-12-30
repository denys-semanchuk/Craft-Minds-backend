import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { ConversationsModule } from "./conversations/conversations.module";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), UsersModule, ConversationsModule, MulterModule.register()],
  controllers: [],
  providers: []
})
export class AppModule {
}
