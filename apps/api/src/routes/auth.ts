import { Router } from "express";
import { env } from "../config/env";
import { UserModel } from "../models/User";
import { exchangeCodeForToken, fetchGitHubProfile } from "../services/github";
import { signAuthToken } from "../services/token";

export const authRouter = Router();

authRouter.get("/auth/github/callback", async (req, res) => {
  const { code } = req.query;

  if (typeof code !== "string") {
    res.status(400).json({ error: "Missing OAuth code" });
    return;
  }

  try {
    const accessToken = await exchangeCodeForToken(code);
    const profile = await fetchGitHubProfile(accessToken);

    const user = await UserModel.findOneAndUpdate(
      { githubId: String(profile.id) },
      {
        githubId: String(profile.id),
        githubUsername: profile.login,
        name: profile.name ?? profile.login,
        avatarUrl: profile.avatar_url,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const token = signAuthToken(user._id.toString());
    const redirectUrl = new URL("/auth/callback", env.WEB_APP_URL);
    redirectUrl.searchParams.set("token", token);

    res.redirect(redirectUrl.toString());
  } catch (error) {
    const redirectUrl = new URL("/auth/callback", env.WEB_APP_URL);
    redirectUrl.searchParams.set(
      "error",
      error instanceof Error ? error.message : "GitHub OAuth failed",
    );

    res.redirect(redirectUrl.toString());
  }
});
