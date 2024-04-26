import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../../guards/role-auth.guard';

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
    default: Role.User,
  })
  role: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
