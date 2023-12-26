import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), UsersModule, ChatsModule],
  controllers: [],
  providers: []
})
export class AppModule {
}
