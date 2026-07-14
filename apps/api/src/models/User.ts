import { Schema, model, type InferSchemaType } from "mongoose";

export const INTENT_STATUSES = [
  "open_to_mentor",
  "looking_for_mentor",
  "reviewing_portfolios",
  "hackathon_teaming",
  "not_available",
] as const;

const userSchema = new Schema(
  {
    githubId: { type: String, required: true, unique: true },
    githubUsername: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true },
    avatarUrl: { type: String },
    techStack: { type: [String], default: [] },
    intentStatus: {
      type: String,
      enum: INTENT_STATUSES,
      default: "not_available",
    },
    availability: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model("User", userSchema);
