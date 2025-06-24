import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module'; 
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt-strategies';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppMailerModule } from 'src/mailer/mailer.module';
import { PasswordResetService } from './services/password-reset.service';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule,
    PrismaModule,
    AppMailerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, PasswordResetService],
  exports: [AuthService, PasswordResetService],
  controllers: [AuthController],
})
export class AuthModule {}
