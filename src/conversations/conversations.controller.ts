import {
  Body,
  Controller,
  Get, MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { extname } from "path";
import { ConversationsService } from "./conversations.service";
import { AccessTokenGuard } from "../auth/guards";
import { Request } from "express";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { CreateMessageDto } from "./dto/create-message.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Controller("api/chats")
// @UseGuards(AccessTokenGuard)
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {
  }

  @Get()
  async getMyChats(@Req() req: Request) {
    const userId = req.user["sub"] as number;
    return this.conversationsService.getMyConversations(userId);
  }


  @Post()
  async createConversation(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.createConversation(createConversationDto);
  }

  @Get(":id")
  async findConversation(@Req() req: Request, @Param() params: Parameters<any>) {
    const conversationId = Number(params["id"]);
    const userId = req.user["sub"] as number;
    return this.conversationsService.findConversation(conversationId, userId);
  }

  @Get(":id/messages")
  async getMessages(@Req() req: Request, @Param() params: Parameters<any>) {
    const conversationId = Number(params["id"]);
    return this.conversationsService.getMessages({ conversationId });
  }

  @Post("messages")
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.conversationsService.createMessage(createMessageDto);
  }

  @Post("image")
  @UseInterceptors(FileInterceptor("image", {
    storage: diskStorage({
      destination: "./uploads/chatAvatars"
      , filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join("");
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async uploadImage(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 200000 })
    ]
  })) file: Express.Multer.File) {
    console.log(file);
  }

}