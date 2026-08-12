import { model, Schema, Types } from "mongoose";

const tagSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default model("Tag", tagSchema);
