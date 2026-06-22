import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ _id: false })
class Assignment {
  @Prop({ required: true })
  baureihe!: string; // e.g., "964"

  @Prop({ type: [String], required: true })
  modelle!: string[]; // e.g., ["Coupe", "Targa"]
}


@Schema({ _id: false })
class Variant {
  @Prop({ required: true })
  code!: string; // This will hold "01", "02", etc.

  @Prop({ type: [Assignment], required: true })
  assignments!: Assignment[];
}

// Main Product Document
@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, unique: true })
  name!: string; // e.g., "Tankdeckel"

  @Prop({ required: true, unique: true })
  code!: string; // e.g., "TD"

  @Prop({ type: [Variant], default: [] })
  variants!: Variant[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);