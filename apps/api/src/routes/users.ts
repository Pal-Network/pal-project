import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";
import { INTENT_STATUSES, UserModel } from "../models/User";

export const usersRouter = Router();

usersRouter.get(
  "/users/me",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  },
);

usersRouter.patch(
  "/users/me",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const { techStack, intentStatus, availability } = req.body ?? {};

    if (intentStatus !== undefined && !INTENT_STATUSES.includes(intentStatus)) {
      res.status(400).json({
        error: `intentStatus must be one of: ${INTENT_STATUSES.join(", ")}`,
      });
      return;
    }

    if (techStack !== undefined && !Array.isArray(techStack)) {
      res.status(400).json({ error: "techStack must be an array of strings" });
      return;
    }

    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      { $set: { techStack, intentStatus, availability } },
      { new: true, omitUndefined: true, runValidators: true },
    );

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  },
);

usersRouter.get("/users", async (req, res) => {
  const { skill, intentStatus, availableOnly } = req.query;

  const filter: Record<string, unknown> = {};

  if (typeof skill === "string") {
    filter.techStack = { $regex: skill, $options: "i" };
  }

  if (typeof intentStatus === "string") {
    filter.intentStatus = intentStatus;
  }

  if (availableOnly === "true") {
    filter.availability = true;
  }

  const users = await UserModel.find(filter).sort({ createdAt: -1 }).limit(50);

  res.status(200).json({ users });
});
