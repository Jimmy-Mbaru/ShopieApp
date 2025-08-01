import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { $Enums } from '../../../generated/prisma';
import UserRole = $Enums.UserRole;

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either ADMIN or CUSTOMER' })
  role?: UserRole;
}
