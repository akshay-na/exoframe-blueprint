module.exports = {
  // Resolves modules and aliases for cleaner import statements
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },

  resolver: "jest-pnp-resolver", // This helps Jest resolve symlinked modules in pnpm

  // Specifies file extensions for modules
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],

  // Root directory configuration for better project structure
  rootDir: ".",
  roots: ["<rootDir>/test"],

  // Regex pattern to find test files
  testRegex: "(/__test__/.*|(\\.|/)(test|spec))\\.tsx?$",

  // Transform property to use ts-jest for TypeScript files
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  // Collect coverage from specified file types
  collectCoverageFrom: ["**/*.(t|j)sx?"],

  // Patterns to ignore when collecting coverage
  coveragePathIgnorePatterns: [
    ".module.ts$",
    "/node_modules/",
    "/test/",
    "/__test__/helpers/",
    "/__mocks__/",
  ],

  // Directory to output coverage reports
  coverageDirectory: "<rootDir>/coverage",

  // Test environment setup
  testEnvironment: "node",

  // Additional configurations for Google standards
  // Enforce a coverage threshold to maintain high test coverage
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Setup and teardown for tests
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],

  // Improve performance by limiting the number of workers
  maxWorkers: "50%",

  // Clear mocks between tests to ensure test isolation
  clearMocks: true,

  // Optional: Integration with reporting tools or custom reporters
  reporters: ["default", "jest-junit"],

  // Optional: Use verbose output to improve readability of test results
  verbose: true,
};
