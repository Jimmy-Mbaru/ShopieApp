import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ Add ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/cart.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { UserService } from './users/users.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { CloudinaryModule } from './cloudinary/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ Makes env vars available app-wide
    }),
    AuthModule,
    ProductsModule,
    CartsModule,
    PrismaModule,
    UsersModule,
    MailerModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
