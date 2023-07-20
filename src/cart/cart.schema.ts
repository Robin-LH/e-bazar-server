import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema()
class Item {
  @Prop({
    type: MongooseSchema.ObjectId,
    ref: 'Product',
    required: true,
  })
  product: Types.ObjectId;

  @Prop()
  quantity: number;
}

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ required: true })
  userIP: string;

  @Prop()
  products: Item[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
