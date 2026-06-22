import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, CreateVariantDto } from './dto/create-product.dto';

@Controller('products')
@UsePipes(new ValidationPipe({ transform: true }))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto.name);
  }

  // Maps the variant creation directly to its specific parent product ID
  @Post(':id/variants')
  async createVariant(
    @Param('id') id: string, 
    @Body() createVariantDto: CreateVariantDto
  ) {
    return this.productsService.createVariant(id, createVariantDto.assignments);
  }

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }
}