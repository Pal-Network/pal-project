import { Schema, model, type InferSchemaType } from "mongoose";

export const MATCH_STATUSES = ["pending", "accepted", "declined"] as const;

const matchSchema = new Schema(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, trim: true, maxlength: 500 },
    status: {
      type: String,
      enum: MATCH_STATUSES,
      default: "pending",
    },
  },
  { timestamps: true },
);

matchSchema.index(
  { requesterId: 1, recipientId: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } },
);

export type Match = InferSchemaType<typeof matchSchema>;

export const MatchModel = model("Match", matchSchema);
