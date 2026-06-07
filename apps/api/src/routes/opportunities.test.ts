import request from "supertest";
import { createApp } from "../app";
import { signAuthToken } from "../services/token";
import { createUser } from "../../test/factories/user";

const app = createApp();

describe("POST /api/v1/opportunities", () => {
  it("creates an opportunity", async () => {
    const poster = await createUser({
      githubId: "1",
      githubUsername: "poster",
    });
    const token = signAuthToken(poster._id.toString());

    const res = await request(app)
      .post("/api/v1/opportunities")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "mentorship",
        title: "React mentor wanted",
        requirements: "2+ years React",
        compensation: "Free",
      });

    expect(res.status).toBe(201);
    expect(res.body.opportunity.title).toBe("React mentor wanted");
    expect(res.body.opportunity.isOpen).toBe(true);
  });

  it("rejects an invalid type", async () => {
    const poster = await createUser({
      githubId: "1",
      githubUsername: "poster",
    });
    const token = signAuthToken(poster._id.toString());

    const res = await request(app)
      .post("/api/v1/opportunities")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "internship", title: "Not a real type" });

    expect(res.status).toBe(400);
  });

  it("requires auth", async () => {
    const res = await request(app)
      .post("/api/v1/opportunities")
      .send({ type: "gig", title: "Anonymous gig" });

    expect(res.status).toBe(401);
  });
});

describe("GET /api/v1/opportunities", () => {
  it("filters by type", async () => {
    const poster = await createUser({
      githubId: "1",
      githubUsername: "poster",
    });
    const token = signAuthToken(poster._id.toString());

    await request(app)
      .post("/api/v1/opportunities")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "job", title: "Backend engineer" });

    await request(app)
      .post("/api/v1/opportunities")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "gig", title: "One-off script" });

    const res = await request(app)
      .get("/api/v1/opportunities")
      .query({ type: "job" });

    expect(res.status).toBe(200);
    expect(res.body.opportunities).toHaveLength(1);
    expect(res.body.opportunities[0].title).toBe("Backend engineer");
  });
});

describe("PATCH /api/v1/opportunities/:id", () => {
  it("lets the poster close an opportunity", async () => {
    const poster = await createUser({
      githubId: "1",
      githubUsername: "poster",
    });
    const token = signAuthToken(poster._id.toString());

    const createRes = await request(app)
      .post("/api/v1/opportunities")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "job", title: "Backend engineer" });

    const res = await request(app)
      .patch(`/api/v1/opportunities/${createRes.body.opportunity._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isOpen: false });

    expect(res.status).toBe(200);
    expect(res.body.opportunity.isOpen).toBe(false);
  });

  it("forbids non-posters from editing", async () => {
    const poster = await createUser({
      githubId: "1",
      githubUsername: "poster",
    });
    const other = await createUser({ githubId: "2", githubUsername: "other" });
    const posterToken = signAuthToken(poster._id.toString());

    const createRes = await request(app)
      .post("/api/v1/opportunities")
      .set("Authorization", `Bearer ${posterToken}`)
      .send({ type: "job", title: "Backend engineer" });

    const res = await request(app)
      .patch(`/api/v1/opportunities/${createRes.body.opportunity._id}`)
      .set("Authorization", `Bearer ${signAuthToken(other._id.toString())}`)
      .send({ isOpen: false });

    expect(res.status).toBe(403);
  });
});

describe("DELETE /api/v1/opportunities/:id", () => {
  it("lets the poster delete an opportunity", async () => {
    const poster = await createUser({
      githubId: "1",
      githubUsername: "poster",
    });
    const token = signAuthToken(poster._id.toString());

    const createRes = await request(app)
      .post("/api/v1/opportunities")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "job", title: "Backend engineer" });

    const res = await request(app)
      .delete(`/api/v1/opportunities/${createRes.body.opportunity._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);

    const getRes = await request(app).get(
      `/api/v1/opportunities/${createRes.body.opportunity._id}`,
    );
    expect(getRes.status).toBe(404);
  });
});
