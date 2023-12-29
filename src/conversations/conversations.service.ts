import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateConversationDto } from "./dto/create-conversation.dto";

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {
  }

  async uploadConversationAvatar() {

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

  async findConversation(conversationId: number, userId: number) {
    return this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
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

  async getMessages({ conversationId }: { conversationId: number }) {

    return this.prisma.message.findMany({
      where: {
        conversationId
      }
    });
  }

  async createMessage({ conversationId, userId, content }: {
    conversationId: number,
    userId: number,
    content: string
  }) {

    return this.prisma.message.create({
      data: {
        content,
        conversationId,
        senderId: userId
      }
    });
  }
}