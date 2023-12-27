import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Conversation, User } from "@prisma/client";

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {
  }


  async getMyChats(userId: number, type: "PRIVATE" | "GROUP" = "PRIVATE") {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) throw new BadRequestException("Bad request");

    return this.prisma.conversation.findMany({
      where: {
        type,
        Participant: {
          some: {
            id: userId
          }
        }
      }
    });

  }

  async createChat(userId: number, type: "PRIVATE" | "GROUP" = "PRIVATE") {
  }

  async getMessages() {

  }
}
