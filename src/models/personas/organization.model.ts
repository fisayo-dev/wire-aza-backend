import mongoose, { Schema } from "mongoose";

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name of organization is required."],
    },
    username: {
      type: String,
      required: [true, "Username of organization is required."],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description of organization is required."],
      minLength: 20,
    },
    type: {
      type: String,
      required: [true, "Type of organization is required."],
    },
    logo: {
      type: String,
      required: false,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Someone needs to own this organization"],
    },
  },
  { timestamps: true }
);

const OrganizationModel = mongoose.model("Organization", organizationSchema);
export default OrganizationModel;
