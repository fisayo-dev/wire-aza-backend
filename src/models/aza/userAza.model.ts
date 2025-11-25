import mongoose, { Schema } from "mongoose";
import { AzaType } from "../../types/enums/aza.ts";

const userAzaSchema = new Schema(
  {
    account_number: {
      type: String,
      required: [true, "Account Number not specified."],
    },

    bank_code: {
      type: String,
      required: false,
    },

    bank_name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(AzaType),
      required: [true, "The Account Type is not specified."],
    },

    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Someone needs to own this account"],
    },
  },
  { timestamps: true }
);

const UserAzaModel = mongoose.model("UserAza", userAzaSchema);
export default UserAzaModel;
