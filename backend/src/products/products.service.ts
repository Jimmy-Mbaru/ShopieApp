import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductQueryDto } from './dtos/product-query.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary/cloudinary.service';
import { Prisma } from 'generated/prisma';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) { }

  /**
   * Create a product with image upload
   */
  async createWithImage(
    body: CreateProductDto,
    file: Express.Multer.File,
    adminId: string,
  ): Promise<Product> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const uploadResult = await this.cloudinaryService.uploadImage(file);

    return this.prisma.product.create({
      data: {
        ...body,
        image: uploadResult.secure_url,
        availableStock: body.totalStock,
        reservedStock: 0,
        adminId,
      },
    });
  }

  /**
   * Get all products with optional filters
   */
  async findAll(query: ProductQueryDto = {} as ProductQueryDto) {
    const { search, minPrice, maxPrice, sortBy, sortOrder } = query;

    const where: Prisma.ProductWhereInput = {};

    if (search?.trim()) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    const validSortFields = ['name', 'price', 'createdAt'];

    if (sortBy && validSortFields.includes(sortBy)) {
      if (sortOrder && ['asc', 'desc'].includes(sortOrder.toLowerCase())) {
        orderBy[sortBy] = sortOrder.toLowerCase() as 'asc' | 'desc';
      } else {
        orderBy[sortBy] = 'asc';
      }
    } else {
      orderBy.createdAt = 'desc';
    }

    try {
      const products = await this.prisma.product.findMany({
        where,
        orderBy,
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      return { products };
    } catch (e) {
      console.error('Product query error:', e);
      throw new InternalServerErrorException('Failed to query products.');
    }
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        admin: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
  id: string,
  updateProductDto: UpdateProductDto,
  adminId: string,
): Promise<Product> {
  const product = await this.prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }

  if (product.adminId !== adminId) {
    throw new BadRequestException('You can only update your own products');
  }

  return this.prisma.product.update({
    where: { id },
    data: {
      ...updateProductDto,
    },
  });
}


  async remove(id: string, adminId: string): Promise<void> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    if (product.adminId !== adminId)
      throw new BadRequestException('You can only delete your own products');

    const [cartItems, orderItems] = await Promise.all([
      this.prisma.cartItem.count({ where: { productId: id } }),
      this.prisma.orderItem.count({ where: { productId: id } }),
    ]);

    if (cartItems || orderItems) {
      throw new BadRequestException(
        'Cannot delete a product that is in use (carts/orders)',
      );
    }

    await this.prisma.product.delete({ where: { id } });
  }

  async checkAvailability(productId: string, quantity: number): Promise<boolean> {
    const product = await this.findOne(productId);
    return product.availableStock >= quantity;
  }

  async reserveStock(productId: string, quantity: number): Promise<void> {
    const product = await this.findOne(productId);
    if (product.availableStock < quantity)
      throw new BadRequestException('Insufficient stock');

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        availableStock: product.availableStock - quantity,
        reservedStock: product.reservedStock + quantity,
      },
    });
  }

  async releaseStock(productId: string, quantity: number): Promise<void> {
    const product = await this.findOne(productId);

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        availableStock: product.availableStock + quantity,
        reservedStock: Math.max(0, product.reservedStock - quantity),
      },
    });
  }
}
