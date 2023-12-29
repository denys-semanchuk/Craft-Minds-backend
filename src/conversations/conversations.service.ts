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
    const { participantIds } = createConversationDto;
    return this.prisma.conversation.create({
      data: {
        type: "GROUP",
        conversationName: "De",
        participants: {
          connect: participantIds.map(id => ({ id }))
        }
      }
    });
  }

  async getMessages() {

  }
}
