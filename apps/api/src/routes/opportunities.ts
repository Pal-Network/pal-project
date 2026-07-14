import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";
import { OPPORTUNITY_TYPES, OpportunityModel } from "../models/Opportunity";

export const opportunitiesRouter = Router();

opportunitiesRouter.post(
  "/opportunities",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const { type, title, requirements, compensation } = req.body ?? {};

    if (!OPPORTUNITY_TYPES.includes(type)) {
      res.status(400).json({
        error: `type must be one of: ${OPPORTUNITY_TYPES.join(", ")}`,
      });
      return;
    }

    if (typeof title !== "string" || title.trim().length === 0) {
      res.status(400).json({ error: "title is required" });
      return;
    }

    const opportunity = await OpportunityModel.create({
      postedBy: req.userId,
      type,
      title: title.trim(),
      requirements,
      compensation,
    });

    res.status(201).json({ opportunity });
  },
);

opportunitiesRouter.get("/opportunities", async (req, res) => {
  const { type, openOnly } = req.query;

  const filter: Record<string, unknown> = {};

  if (
    typeof type === "string" &&
    OPPORTUNITY_TYPES.includes(type as (typeof OPPORTUNITY_TYPES)[number])
  ) {
    filter.type = type;
  }

  if (openOnly === "true") {
    filter.isOpen = true;
  }

  const opportunities = await OpportunityModel.find(filter)
    .sort({ createdAt: -1 })
    .populate("postedBy", "githubUsername name avatarUrl");

  res.status(200).json({ opportunities });
});

opportunitiesRouter.get("/opportunities/:id", async (req, res) => {
  const opportunity = await OpportunityModel.findById(req.params.id).populate(
    "postedBy",
    "githubUsername name avatarUrl",
  );

  if (!opportunity) {
    res.status(404).json({ error: "Opportunity not found" });
    return;
  }

  res.status(200).json({ opportunity });
});

opportunitiesRouter.patch(
  "/opportunities/:id",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const opportunity = await OpportunityModel.findById(req.params.id);

    if (!opportunity) {
      res.status(404).json({ error: "Opportunity not found" });
      return;
    }

    if (opportunity.postedBy.toString() !== req.userId) {
      res
        .status(403)
        .json({ error: "Only the poster can update this opportunity" });
      return;
    }

    const { title, requirements, compensation, isOpen } = req.body ?? {};

    if (title !== undefined) opportunity.title = title;
    if (requirements !== undefined) opportunity.requirements = requirements;
    if (compensation !== undefined) opportunity.compensation = compensation;
    if (isOpen !== undefined) opportunity.isOpen = isOpen;

    await opportunity.save();

    res.status(200).json({ opportunity });
  },
);

opportunitiesRouter.delete(
  "/opportunities/:id",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const opportunity = await OpportunityModel.findById(req.params.id);

    if (!opportunity) {
      res.status(404).json({ error: "Opportunity not found" });
      return;
    }

    if (opportunity.postedBy.toString() !== req.userId) {
      res
        .status(403)
        .json({ error: "Only the poster can delete this opportunity" });
      return;
    }

    await opportunity.deleteOne();

    res.status(204).send();
  },
);
