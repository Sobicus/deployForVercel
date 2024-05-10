import { randomUUID } from "crypto";
import { add } from "date-fns";
import { HydratedDocument, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class PasswordRecovery {
  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  recoveryCode: string;
  @Prop({ type: String, required: true })
  recoveryCodeExpireDate: Date;
  @Prop({ type: Boolean, required: true })
  alreadyChangePassword: boolean;

  constructor(userId: string) {
    (this._id = new Types.ObjectId()),
      (this.userId = userId),
      (this.recoveryCode = randomUUID()),
      (this.recoveryCodeExpireDate = add(new Date(), {
        hours: 3,
        minutes: 3,
        seconds: 3
      }));
    this.alreadyChangePassword = false;
  }
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);
PasswordRecoverySchema.loadClass(PasswordRecovery);
export type PasswordRecoveryDocument = HydratedDocument<PasswordRecovery>;
