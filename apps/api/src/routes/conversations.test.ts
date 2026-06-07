import request from "supertest";
import { createApp } from "../app";
import { signAuthToken } from "../services/token";
import { createUser } from "../../test/factories/user";

const app = createApp();

async function createAcceptedMatch() {
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

  await request(app)
    .patch(`/api/v1/matches/${createRes.body.match._id}`)
    .set("Authorization", `Bearer ${recipientToken}`)
    .send({ status: "accepted" });

  return {
    requester,
    recipient,
    requesterToken,
    recipientToken,
    matchId: createRes.body.match._id,
  };
}

describe("GET /api/v1/matches/:matchId/conversation", () => {
  it("returns 404 when the match hasn't been accepted", async () => {
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
      .get(`/api/v1/matches/${createRes.body.match._id}/conversation`)
      .set("Authorization", `Bearer ${requesterToken}`);

    expect(res.status).toBe(404);
  });

  it("returns the conversation for participants once accepted", async () => {
    const { requesterToken, matchId } = await createAcceptedMatch();

    const res = await request(app)
      .get(`/api/v1/matches/${matchId}/conversation`)
      .set("Authorization", `Bearer ${requesterToken}`);

    expect(res.status).toBe(200);
    expect(res.body.conversation.messages).toEqual([]);
  });

  it("forbids non-participants", async () => {
    const { matchId } = await createAcceptedMatch();
    const outsider = await createUser({
      githubId: "3",
      githubUsername: "outsider",
    });

    const res = await request(app)
      .get(`/api/v1/matches/${matchId}/conversation`)
      .set("Authorization", `Bearer ${signAuthToken(outsider._id.toString())}`);

    expect(res.status).toBe(403);
  });
});

describe("POST /api/v1/matches/:matchId/conversation/messages", () => {
  it("appends a message from a participant", async () => {
    const { requesterToken, recipientToken, matchId } =
      await createAcceptedMatch();

    const res = await request(app)
      .post(`/api/v1/matches/${matchId}/conversation/messages`)
      .set("Authorization", `Bearer ${requesterToken}`)
      .send({ body: "Hey, thanks for accepting!" });

    expect(res.status).toBe(201);
    expect(res.body.conversation.messages).toHaveLength(1);
    expect(res.body.conversation.messages[0].body).toBe(
      "Hey, thanks for accepting!",
    );

    const followUp = await request(app)
      .post(`/api/v1/matches/${matchId}/conversation/messages`)
      .set("Authorization", `Bearer ${recipientToken}`)
      .send({ body: "Of course!" });

    expect(followUp.body.conversation.messages).toHaveLength(2);
  });

  it("rejects an empty message body", async () => {
    const { requesterToken, matchId } = await createAcceptedMatch();

    const res = await request(app)
      .post(`/api/v1/matches/${matchId}/conversation/messages`)
      .set("Authorization", `Bearer ${requesterToken}`)
      .send({ body: "   " });

    expect(res.status).toBe(400);
  });
});
