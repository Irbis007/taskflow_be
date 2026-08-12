import { getTagDto } from "../dtos/tagDto";
import { ApiError } from "../exceptions/api-error";
import tagModel from "../models/tag-model";
import { Tag } from "../types";

const getAllTags = async () => {
  const tags = await tagModel.find();
  if (!tags) {
    throw ApiError.BadRequest("Cannot find Tags");
  }
  const tagsDto = tags.map((tag) => getTagDto(tag));
  return tagsDto;
};

const createTag = async (tagData: Tag) => {
  const tag = await tagModel.create({ ...tagData });
  if (!tag) {
    throw ApiError.BadRequest("Something went wrong while creating tag");
  }
  const tagDto = getTagDto(tag);
  return tagDto;
};

export const tagService = {
  getTags: getAllTags,
  createTag,
};
