import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  );
  app.use(cookieParser(config.get("COOKIE_SECRET")));
  app.enableCors({
    credentials:true,
    origin: 'http://localhost:3000'
  })
  await app.listen(3004);
}

bootstrap();
