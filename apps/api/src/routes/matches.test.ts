import request from "supertest";
import { createApp } from "../app";
import { signAuthToken } from "../services/token";
import { createUser } from "../../test/factories/user";

const app = createApp();

describe("POST /api/v1/matches", () => {
  it("creates a pending match request", async () => {
    const requester = await createUser({
      githubId: "1",
      githubUsername: "requester",
    });
    const recipient = await createUser({
      githubId: "2",
      githubUsername: "recipient",
    });
    const token = signAuthToken(requester._id.toString());

    const res = await request(app)
      .post("/api/v1/matches")
      .set("Authorization", `Bearer ${token}`)
      .send({
        recipientId: recipient._id.toString(),
        message: "Can you review my project?",
      });

    expect(res.status).toBe(201);
    expect(res.body.match.status).toBe("pending");
    expect(res.body.match.requesterId).toBe(requester._id.toString());
    expect(res.body.match.recipientId).toBe(recipient._id.toString());
  });

  it("rejects matching yourself", async () => {
    const requester = await createUser({
      githubId: "1",
      githubUsername: "requester",
    });
    const token = signAuthToken(requester._id.toString());

    const res = await request(app)
      .post("/api/v1/matches")
      .set("Authorization", `Bearer ${token}`)
      .send({ recipientId: requester._id.toString() });

    expect(res.status).toBe(400);
  });

  it("rejects a duplicate pending request", async () => {
    const requester = await createUser({
      githubId: "1",
      githubUsername: "requester",
    });
    const recipient = await createUser({
      githubId: "2",
      githubUsername: "recipient",
    });
    const token = signAuthToken(requester._id.toString());

    await request(app)
      .post("/api/v1/matches")
      .set("Authorization", `Bearer ${token}`)
      .send({ recipientId: recipient._id.toString() });

    const res = await request(app)
      .post("/api/v1/matches")
      .set("Authorization", `Bearer ${token}`)
      .send({ recipientId: recipient._id.toString() });

    expect(res.status).toBe(409);
  });
});

describe("PATCH /api/v1/matches/:id", () => {
  it("lets the recipient accept a match", async () => {
    const requester = await createUser({
      githubId: "1",
      githubUsername: "requester",
    });
    const recipient = await createUser({
      githubId: "2",
      githubUsername: "recipient",
    });
    const requesterToken = signAuthToken(requester._id.toString());
    const recipientToken = signAuthToken(recipient._id.toString());

    const createRes = await request(app)
      .post("/api/v1/matches")
      .set("Authorization", `Bearer ${requesterToken}`)
      .send({ recipientId: recipient._id.toString() });

    const res = await request(app)
      .patch(`/api/v1/matches/${createRes.body.match._id}`)
      .set("Authorization", `Bearer ${recipientToken}`)
      .send({ status: "accepted" });

    expect(res.status).toBe(200);
    expect(res.body.match.status).toBe("accepted");
  });

  it("forbids the requester from responding to their own request", async () => {
    const requester = await createUser({
      githubId: "1",
      githubUsername: "requester",
    });
    const recipient = await createUser({
      githubId: "2",
      githubUsername: "recipient",
    });
    const requesterToken = signAuthToken(requester._id.toString());

    const createRes = await request(app)
      .post("/api/v1/matches")
      .set("Authorization", `Bearer ${requesterToken}`)
      .send({ recipientId: recipient._id.toString() });

    const res = await request(app)
      .patch(`/api/v1/matches/${createRes.body.match._id}`)
      .set("Authorization", `Bearer ${requesterToken}`)
      .send({ status: "accepted" });

    expect(res.status).toBe(403);
  });
});

describe("GET /api/v1/matches", () => {
  it("lists matches involving the current user", async () => {
    const requester = await createUser({
      githubId: "1",
      githubUsername: "requester",
    });
    const recipient = await createUser({
      githubId: "2",
      githubUsername: "recipient",
    });
    const outsider = await createUser({
      githubId: "3",
      githubUsername: "outsider",
    });
    const requesterToken = signAuthToken(requester._id.toString());

    await request(app)
      .post("/api/v1/matches")
      .set("Authorization", `Bearer ${requesterToken}`)
      .send({ recipientId: recipient._id.toString() });

    const res = await request(app)
      .get("/api/v1/matches")
      .set("Authorization", `Bearer ${signAuthToken(outsider._id.toString())}`);

    expect(res.status).toBe(200);
    expect(res.body.matches).toHaveLength(0);
  });
});
