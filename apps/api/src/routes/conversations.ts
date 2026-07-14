import { Router } from "express";
import { Types } from "mongoose";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";
import { ConversationModel } from "../models/Conversation";

export const conversationsRouter = Router();

async function findConversationForUser(
  matchId: string,
  userId: string | undefined,
) {
  const conversation = await ConversationModel.findOne({ matchId }).populate(
    "participantIds",
    "githubUsername name avatarUrl",
  );

  if (!conversation) {
    return { conversation: null, isParticipant: false };
  }

  const isParticipant = conversation.participantIds.some(
    (participant) => participant._id.toString() === userId,
  );

  return { conversation, isParticipant };
}

conversationsRouter.get(
  "/matches/:matchId/conversation",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const { conversation, isParticipant } = await findConversationForUser(
      req.params.matchId,
      req.userId,
    );

    if (!conversation) {
      res.status(404).json({
        error: "No conversation exists yet — the match must be accepted first",
      });
      return;
    }

    if (!isParticipant) {
      res.status(403).json({ error: "You are not part of this conversation" });
      return;
    }

    res.status(200).json({ conversation });
  },
);

conversationsRouter.post(
  "/matches/:matchId/conversation/messages",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const { body } = req.body ?? {};

    if (typeof body !== "string" || body.trim().length === 0) {
      res.status(400).json({ error: "Message body is required" });
      return;
    }

    const { conversation, isParticipant } = await findConversationForUser(
      req.params.matchId,
      req.userId,
    );

    if (!conversation) {
      res.status(404).json({
        error: "No conversation exists yet — the match must be accepted first",
      });
      return;
    }

    if (!isParticipant) {
      res.status(403).json({ error: "You are not part of this conversation" });
      return;
    }

    conversation.messages.push({
      senderId: new Types.ObjectId(req.userId),
      body: body.trim(),
    });
    await conversation.save();

    res.status(201).json({ conversation });
  },
);
