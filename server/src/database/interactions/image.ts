import { IImage } from "../../interfaces/IImage";
import { Image, IImageModel } from "../models/image";

export const imageDBInteractions = {
  create: (image: IImage): Promise<IImageModel> => {
    return Image.create(image);
  },

  all: (): Promise<IImageModel[]> => {
    return Image.find({ isPublic: true }).exec();
  },

  allByUser: (userId: string): Promise<IImageModel[]> => {
    return Image.find({ userId: userId }).exec();
  },

  find: (imageId: string): Promise<IImageModel> => {
    return Image.findOne({ _id: imageId }).exec();
  },

  delete: (imageId: string): Promise<IImageModel> => {
    return Image.findByIdAndDelete(imageId).exec();
  },
};
