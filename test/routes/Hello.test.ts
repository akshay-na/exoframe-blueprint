import App from "@/app/BoilerplateApp";
import request from "supertest";

describe("GET /api/v1/hello", () => {
  it("should respond with Hello World!", async () => {
    const res = await request(App()).get("/api/v1/hello");
    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe("Hello World!");
  });

  it("should handle invalid query parameter types gracefully", async () => {
    const res = await request(App()).get("/api/v1/hello?name=1234");
    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe("Hello 1234!"); // Treating name as string, even if it's numeric
  });
});

describe("GET /api/v1/hello?name=Akshay", () => {
  it("should respond with Hello Akshay!", async () => {
    const res = await request(App()).get("/api/v1/hello?name=Akshay");
    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe("Hello Akshay!");
  });

  it("should respond with correct message for different name", async () => {
    const res = await request(App()).get("/api/v1/hello?name=John");
    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe("Hello John!");
  });
});

describe("POST /api/v1/hello", () => {
  it("should respond with POSTED", async () => {
    const res = await request(App())
      .post("/api/v1/hello")
      .send({
        id: "user123",
        age: 28,
        gender: "M",
        location: { lat: 13.7563, lon: 100.5018 },
        interests: ["music", "art", "travel"],
      })
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe("POSTED");
  });

  it("should respond with error when required fields are missing", async () => {
    const res = await request(App())
      .post("/api/v1/hello")
      .send({
        id: "user123", // Missing age, gender, location, and interests
      })
      .set("Accept", "application/json");
    expect(res.status).toBe(400); // Assuming these fields are required
    expect(res.body.error.error).toBe("VALIDATION_FAILED");
  });

  it("should handle invalid body types gracefully", async () => {
    const res = await request(App())
      .post("/api/v1/hello")
      .send({
        id: "user123",
        age: "twenty-eight", // Invalid type
        gender: "M",
        location: { lat: 13.7563, lon: 100.5018 },
        interests: ["music", "art", "travel"],
      })
      .set("Accept", "application/json");
    expect(res.status).toBe(400);
    expect(res.body.error.error).toBe("VALIDATION_FAILED");
  });
});

describe("PUT /api/v1/hello/:name", () => {
  it("should respond with Hello Akshay!", async () => {
    const res = await request(App())
      .put("/api/v1/hello/Akshay")
      .send({
        body: {
          id: "user123",
          age: 28,
          gender: "M",
          location: { lat: 13.7563, lon: 100.5018 },
          interests: ["music", "art", "travel"],
        },
      })
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe("Hello Akshay!");
  });

  it("should respond with error when missing required fields in body", async () => {
    const res = await request(App())
      .put("/api/v1/hello/Akshay")
      .send({
        body: { id: "user123" }, // Missing other required fields
      })
      .set("Accept", "application/json");
    expect(res.status).toBe(400);
    expect(res.body.error.error).toBe("VALIDATION_FAILED");
  });

  it("should handle invalid data type in PUT request body", async () => {
    const res = await request(App())
      .put("/api/v1/hello/Akshay")
      .send({
        body: {
          id: "user123",
          age: "twenty-eight", // Invalid type for age
          gender: "M",
          location: { lat: 13.7563, lon: 100.5018 },
          interests: ["music", "art", "travel"],
        },
      })
      .set("Accept", "application/json");
    expect(res.status).toBe(400);
    expect(res.body.error.error).toBe("VALIDATION_FAILED");
  });
});

describe("Performance tests", () => {
  it("should respond within 300ms for GET request", async () => {
    const start = Date.now();
    const res = await request(App()).get("/api/v1/hello");
    const end = Date.now();
    expect(end - start).toBeLessThan(300); // Test response time under 300ms
    expect(res.status).toBe(200);
  });
});

describe("Response structure validation", () => {
  it("should have the correct structure for GET /api/v1/hello", async () => {
    const res = await request(App()).get("/api/v1/hello");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("message");
    expect(res.body.data.message).toBe("Hello World!");
  });
});
