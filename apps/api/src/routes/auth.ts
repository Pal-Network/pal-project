import { Router } from "express";
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

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(502).json({
      error: error instanceof Error ? error.message : "GitHub OAuth failed",
    });
  }
});
