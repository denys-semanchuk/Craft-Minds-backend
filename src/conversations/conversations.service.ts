import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateConversationDto } from "./dto/create-conversation.dto";

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {
  }


  async getMyConversations(userId: number, type: "PRIVATE" | "GROUP" = "PRIVATE") {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) throw new BadRequestException("Bad request");

    return this.prisma.conversation.findMany({
      where: {
        type,
        participants: {
          some: {
            id: userId
          }
        }
      }
    });

  }

  async createConversation(createConversationDto: CreateConversationDto) {
    const { type, participantIds, conversationName, conversationAvatar } = createConversationDto;
    return this.prisma.conversation.create({
      data: {
        type,
        conversationName,
        conversationAvatar,
        participants: {
          connect: participantIds.map(id => ({ id }))
        }
      }
    });
  }

  async getMessages({ userId, conversationId }: { userId: number, conversationId: number }) {
    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
        AND: {
          participants: {
            some: {
              id: userId
            }
          }
        }
      }
    });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!conversation || !user) throw new BadRequestException("Bad Request Error");

    return this.prisma.message.findMany({
      where: {
        conversationId
      }
    })
  }
}
