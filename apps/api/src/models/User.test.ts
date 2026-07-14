import { UserModel } from "./User";

describe("UserModel", () => {
  it("enforces unique githubUsername", async () => {
    await UserModel.create({ githubId: "1", githubUsername: "dupe" });

    await expect(
      UserModel.create({ githubId: "2", githubUsername: "dupe" }),
    ).rejects.toThrow();
  });

  it("defaults intentStatus and availability", async () => {
    const user = await UserModel.create({
      githubId: "1",
      githubUsername: "defaulted",
    });

    expect(user.intentStatus).toBe("not_available");
    expect(user.availability).toBe(true);
  });
});
