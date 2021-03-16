const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    code: {
      type: String,
      minlength: 6,
      maxlength: 6,
      unique: true,
      required: true,
    },
    members: [{ type: ObjectId, ref: "User" }],
    max: {
      type: Number,
      default: 8,
      immutable: true,
    },
    admin: {
      type: ObjectId,
      ref: "User",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
