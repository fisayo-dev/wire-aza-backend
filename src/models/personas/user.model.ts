import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Pls fill a valid email address"],
    },
    password: {
      type: String,
      required: false,
      minLength: 6,
    },
    avatar: {
      type: String,
      required: false,
      trim: true,
    },
    oauth: {
      type: Object,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
