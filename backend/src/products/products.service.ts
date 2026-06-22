import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './infrastructure/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  // 1. Create a Product & Automatically Generate the shortcode
  async createProduct(name: string): Promise<Product> {
    const cleanName = name.trim();
    
    // Check if product already exists (Collision handling)
    const existing = await this.productModel.findOne({ name: cleanName });
    if (existing) {
      throw new ConflictException(`Product with name "${cleanName}" already exists.`);
    }

    // Generate code (e.g., "Tankdeckel" -> "TD")
    // Takes the first letter of the first two words, or first two letters of one word.
    const words = cleanName.split(/\s+/);
    let code = '';
    if (words.length >= 2) {
      code = (words[0][0] + words[1][0]).toUpperCase();
    } else {
      code = cleanName.substring(0, 2).toUpperCase();
    }

    const newProduct = new this.productModel({ name: cleanName, code, variants: [] });
    return newProduct.save();
  }

  // 2. Fetch all products
  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  // 3. Automatically assign the next free variant number and add it
  async createVariant(productId: string, assignments: any[]): Promise<Product> {
    // Validate that there is at least one assignment mapping
    if (!assignments || assignments.length === 0) {
      throw new BadRequestException('A variant must have at least one assignment.');
    }

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    // Auto-calculate next string value (e.g., 0 existing -> "01", 1 existing -> "02")
    const nextIndex = product.variants.length + 1;
    const variantCode = nextIndex.toString().padStart(2, '0'); // Formats into "01", "02", etc.

    // Push the new variant structure into our array
    product.variants.push({
      code: variantCode,
      assignments,
    });

    return product.save();
  }
}