import request from "supertest";
import { createApp } from "../app";
import { signAuthToken } from "../services/token";
import { createUser } from "../../test/factories/user";

const app = createApp();

describe("GET /api/v1/users/me", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).get("/api/v1/users/me");
    expect(res.status).toBe(401);
  });

  it("returns the authenticated user", async () => {
    const user = await createUser();
    const token = signAuthToken(user._id.toString());

    const res = await request(app)
      .get("/api/v1/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.githubUsername).toBe("octocat");
  });
});

describe("PATCH /api/v1/users/me", () => {
  it("updates intent status and tech stack", async () => {
    const user = await createUser();
    const token = signAuthToken(user._id.toString());

    const res = await request(app)
      .patch("/api/v1/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        intentStatus: "hackathon_teaming",
        techStack: ["rust", "soroban"],
      });

    expect(res.status).toBe(200);
    expect(res.body.user.intentStatus).toBe("hackathon_teaming");
    expect(res.body.user.techStack).toEqual(["rust", "soroban"]);
  });

  it("rejects an invalid intent status", async () => {
    const user = await createUser();
    const token = signAuthToken(user._id.toString());

    const res = await request(app)
      .patch("/api/v1/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ intentStatus: "not_a_real_status" });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/users", () => {
  it("lists users and filters by skill", async () => {
    await createUser({
      githubId: "1",
      githubUsername: "rustacean",
      techStack: ["rust"],
    });
    await createUser({
      githubId: "2",
      githubUsername: "typer",
      techStack: ["typescript"],
    });

    const res = await request(app)
      .get("/api/v1/users")
      .query({ skill: "rust" });

    expect(res.status).toBe(200);
    expect(res.body.users).toHaveLength(1);
    expect(res.body.users[0].githubUsername).toBe("rustacean");
  });

  it("filters by availability", async () => {
    await createUser({
      githubId: "1",
      githubUsername: "available-dev",
      availability: true,
    });
    await createUser({
      githubId: "2",
      githubUsername: "busy-dev",
      availability: false,
    });

    const res = await request(app)
      .get("/api/v1/users")
      .query({ availableOnly: "true" });

    expect(res.status).toBe(200);
    expect(res.body.users).toHaveLength(1);
    expect(res.body.users[0].githubUsername).toBe("available-dev");
  });
});
