// test/setup.ts

// Extend Jest matchers to use jest-dom for DOM testing
import "@testing-library/jest-dom";
import "jest-extended";
import "tsconfig-paths/register";

import Application from "@/app/App";

const application: Application = new Application();
declare global {
  var app: any;
}

beforeAll(async () => {
  app = await application.initialize();

  // Additional setup like mocking external services can go here.
  // For example, mock API calls using 'nock', or mock external modules using 'jest.mock()'

  // Optional: mock external APIs or services (e.g., for sending email, payments, etc.)
  // jest.mock('some-external-service', () => ({
  //   sendEmail: jest.fn().mockResolvedValue(true),
  // }));
});

afterAll(async () => {
  // Teardown after all tests are done
  // Clean up global mocks (if needed)
  // jest.restoreAllMocks(); // Restore any mocked modules or services
  await application.shutdown();
});

afterEach(() => {
  // You can add code here to clean up any data or mocks before each test, if needed
  // For example, clearing the mock calls or clearing the database
  jest.clearAllMocks(); // Clear mock function calls and states
});
