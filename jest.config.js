module.exports = {
  rootDir: ".",
  roots: ["<rootDir>/test"],
  collectCoverageFrom: ["**/*.(t|j)sx?"],
  coverageDirectory: "<rootDir>/coverage",
  testEnvironment: "node",
  testRegex: "(/__test__/.*|(\\.|/)(test|spec))\\.tsx?$",
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  maxWorkers: "50%",
  clearMocks: true,
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "<rootDir>/coverage",
        outputName: "junit.xml",
      },
    ],
  ],
  verbose: true,
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  coveragePathIgnorePatterns: [
    ".module.ts$",
    "/node_modules/",
    "/test/",
    "/__test__/helpers/",
    "/__mocks__/",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
