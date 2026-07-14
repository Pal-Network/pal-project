import { env } from "../env";

export interface DiscoverUser {
  _id: string;
  githubUsername: string;
  name?: string;
  avatarUrl?: string;
  techStack: string[];
  intentStatus: string;
  availability: boolean;
}

export interface DiscoverFilters {
  skill?: string;
  intentStatus?: string;
  availableOnly?: boolean;
}

export async function fetchDiscoverUsers(
  filters: DiscoverFilters = {},
): Promise<DiscoverUser[]> {
  const params = new URLSearchParams();

  if (filters.skill) params.set("skill", filters.skill);
  if (filters.intentStatus) params.set("intentStatus", filters.intentStatus);
  if (filters.availableOnly) params.set("availableOnly", "true");

  const response = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/api/v1/users?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to load builders");
  }

  const data = (await response.json()) as { users: DiscoverUser[] };
  return data.users;
}

export async function fetchCurrentUser(token: string): Promise<DiscoverUser> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to load your profile");
  }

  const data = (await response.json()) as { user: DiscoverUser };
  return data.user;
}

export function buildGithubAuthorizeUrl(): string {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", env.NEXT_PUBLIC_GITHUB_CLIENT_ID);
  url.searchParams.set("scope", "read:user");
  url.searchParams.set(
    "redirect_uri",
    `${env.NEXT_PUBLIC_API_URL}/api/v1/auth/github/callback`,
  );
  return url.toString();
}

export const AUTH_TOKEN_STORAGE_KEY = "pal_auth_token";
