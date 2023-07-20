import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class Discount {
  @Prop()
  start: string;
  end: string;
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  price: string;

  @Prop()
  discount: Discount;

  @Prop()
  image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
