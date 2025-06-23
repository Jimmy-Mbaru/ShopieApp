import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/cart.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { UserService } from './users/users.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [AuthModule, ProductsModule, CartsModule, PrismaModule, UsersModule, MailerModule],
  controllers: [AppController],
  providers: [AppService, UserService ],
})
export class AppModule {}
