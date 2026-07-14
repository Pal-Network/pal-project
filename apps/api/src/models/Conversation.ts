import { Schema, model, type InferSchemaType } from "mongoose";

const messageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const conversationSchema = new Schema(
  {
    matchId: {
      type: Schema.Types.ObjectId,
      ref: "Match",
      required: true,
      unique: true,
    },
    participantIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
      validate: {
        validator: (value: unknown[]) => value.length === 2,
        message: "A conversation must have exactly two participants",
      },
    },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true },
);

export type Conversation = InferSchemaType<typeof conversationSchema>;

export const ConversationModel = model("Conversation", conversationSchema);
