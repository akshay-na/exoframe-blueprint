import request from "supertest";
import app from "../src/app/App"; // Make sure to correctly point to your app

describe("GET /", () => {
  it("should respond with Hello World!", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200); // Check if the response status is 200
    expect(res.text).toBe("Hello World!"); // Check if response body contains 'Hello World!'
  });
});
