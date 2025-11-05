import request from "supertest";
import { expect } from "chai";
import app from "../../app.js";

describe("Root Route /", () => {
  it("should return a hello message", async () => {
    const res = await request(app).get("/");
    expect(res.status).to.equal(200);
    expect(res.text).to.equal("Hello Express");
  });
});
