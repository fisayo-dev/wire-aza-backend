import mongoose, { Schema } from "mongoose";
import { AzaType } from "../../types/enums/aza.ts";

const organizationAzaSchema = new Schema(
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

    userOwner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Someone needs to own this account"],
    },

    organizationOwner: {
      type: mongoose.Types.ObjectId,
      ref: "Organization",
      required: [true, "An organization needs to own this account"],
    },
  },
  { timestamps: true }
);

const OrganizationAzaModel = mongoose.model(
  "OrganizationAza",
  organizationAzaSchema
);
export default OrganizationAzaModel;
