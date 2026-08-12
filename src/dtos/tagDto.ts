import tagModel from "../models/tag-model";
import { Types } from "mongoose";

type Tag = {
  name: string;
  id: Types.ObjectId;
};

export const getTagDto = (model: InstanceType<typeof tagModel> | null): Tag => {
  return model
    ? {
        name: model.name,
        id: model._id,
      }
    : ({} as Tag);
};
