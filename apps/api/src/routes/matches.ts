import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";
import { ConversationModel } from "../models/Conversation";
import { MATCH_STATUSES, MatchModel } from "../models/Match";
import { UserModel } from "../models/User";

export const matchesRouter = Router();

matchesRouter.post(
  "/matches",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const { recipientId, message } = req.body ?? {};

    if (typeof recipientId !== "string") {
      res.status(400).json({ error: "recipientId is required" });
      return;
    }

    if (recipientId === req.userId) {
      res
        .status(400)
        .json({ error: "You cannot send a match request to yourself" });
      return;
    }

    const recipient = await UserModel.findById(recipientId);

    if (!recipient) {
      res.status(404).json({ error: "Recipient not found" });
      return;
    }

    try {
      const match = await MatchModel.create({
        requesterId: req.userId,
        recipientId,
        message,
      });

      res.status(201).json({ match });
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code?: number }).code === 11000
      ) {
        res
          .status(409)
          .json({ error: "A pending match request already exists" });
        return;
      }

      throw error;
    }
  },
);

matchesRouter.get(
  "/matches",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const { status } = req.query;

    const filter: Record<string, unknown> = {
      $or: [{ requesterId: req.userId }, { recipientId: req.userId }],
    };

    if (
      typeof status === "string" &&
      MATCH_STATUSES.includes(status as (typeof MATCH_STATUSES)[number])
    ) {
      filter.status = status;
    }

    const matches = await MatchModel.find(filter)
      .sort({ createdAt: -1 })
      .populate("requesterId", "githubUsername name avatarUrl")
      .populate("recipientId", "githubUsername name avatarUrl");

    res.status(200).json({ matches });
  },
);

matchesRouter.patch(
  "/matches/:id",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const { status } = req.body ?? {};

    if (status !== "accepted" && status !== "declined") {
      res
        .status(400)
        .json({ error: "status must be 'accepted' or 'declined'" });
      return;
    }

    const match = await MatchModel.findById(req.params.id);

    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    if (match.recipientId.toString() !== req.userId) {
      res
        .status(403)
        .json({ error: "Only the recipient can respond to this match" });
      return;
    }

    if (match.status !== "pending") {
      res.status(409).json({ error: "This match has already been resolved" });
      return;
    }

    match.status = status;
    await match.save();

    if (status === "accepted") {
      await ConversationModel.findOneAndUpdate(
        { matchId: match._id },
        {
          matchId: match._id,
          participantIds: [match.requesterId, match.recipientId],
        },
        { upsert: true, setDefaultsOnInsert: true },
      );
    }

    res.status(200).json({ match });
  },
);
