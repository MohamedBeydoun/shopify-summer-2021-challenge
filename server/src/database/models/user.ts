import { Document, Model, model, Schema } from "mongoose";
import { IUser } from "../../interfaces/IUser";

export interface IUserModel extends IUser, Document {}

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    minimize: false,
  },
);

userSchema.index(
  {
    email: 1,
  },
  {
    unique: true,
  },
);

userSchema.index(
  {
    username: 1,
  },
  {
    unique: true,
  },
);

const User: Model<IUserModel> = model("User", userSchema);

export { User };
