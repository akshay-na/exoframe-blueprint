import request from "supertest";
import App from "../src/app/BoilerplateApp";

describe("GET /api/v1/hello", () => {
  it("should respond with Hello World!", async () => {
    const res = await request(App()).get("/api/v1/hello");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Hello World!");
  });
});
