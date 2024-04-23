import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from './user.roleGuard';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
    enum: Role,
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
