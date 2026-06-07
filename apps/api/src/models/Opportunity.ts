import { Schema, model, type InferSchemaType } from "mongoose";

export const OPPORTUNITY_TYPES = ["mentorship", "gig", "job"] as const;

const opportunitySchema = new Schema(
  {
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: OPPORTUNITY_TYPES, required: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    requirements: { type: String, trim: true, maxlength: 2000 },
    compensation: { type: String, trim: true, maxlength: 140 },
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type Opportunity = InferSchemaType<typeof opportunitySchema>;

export const OpportunityModel = model("Opportunity", opportunitySchema);
