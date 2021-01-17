import { Document, Model, model, Schema } from "mongoose";
import { IImage } from "../../interfaces/IImage";

export interface IImageModel extends IImage, Document {}

const imageSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
    },
    tags: {
      type: [String],
    },
    path: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  },
);

const Image: Model<IImageModel> = model("Image", imageSchema);

export { Image };
