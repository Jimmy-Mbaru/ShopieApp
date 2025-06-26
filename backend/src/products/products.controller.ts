import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role-decorator';
import { $Enums } from '../../generated/prisma';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ProductQueryDto } from './dtos/product-query.dto';

const { ADMIN } = $Enums.UserRole;

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  // Admin: Create a product
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) body: CreateProductDto,
    @Request() req,
  ) {
    return this.productService.createWithImage(body, file, req.user.id);
  }

  // Public: Get all products
  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    return this.productService.findAll(query);
  }

  // Admin: Delete product by ID
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    await this.productService.remove(id, req.user.id);
  }

// Admin: Update product by ID
@Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ADMIN)
@ApiBearerAuth('JWT-auth')
@HttpCode(HttpStatus.OK)
async update(
  @Param('id') id: string,
  @Body(ValidationPipe) updateDto: UpdateProductDto,
  @Request() req,
) {
  return this.productService.update(id, updateDto, req.user.id);
}

}
