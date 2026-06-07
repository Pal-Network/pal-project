import { UserModel } from "../../src/models/User";

export async function createUser(
  overrides: Partial<Record<string, unknown>> = {},
) {
  return UserModel.create({
    githubId: overrides.githubId ?? "1",
    githubUsername: overrides.githubUsername ?? "octocat",
    name: overrides.name ?? "Octo Cat",
    techStack: overrides.techStack ?? ["typescript"],
    intentStatus: overrides.intentStatus ?? "looking_for_mentor",
    availability: overrides.availability ?? true,
  });
}
