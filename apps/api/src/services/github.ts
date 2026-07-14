import { env } from "../config/env";

interface GitHubTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

export interface GitHubProfile {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: env.GITHUB_CALLBACK_URL,
    }),
  });

  const data = (await response.json()) as GitHubTokenResponse;

  if (!data.access_token) {
    throw new Error(
      data.error_description ?? "Failed to exchange GitHub OAuth code",
    );
  }

  return data.access_token;
}

export async function fetchGitHubProfile(
  accessToken: string,
): Promise<GitHubProfile> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub profile");
  }

  return (await response.json()) as GitHubProfile;
}
