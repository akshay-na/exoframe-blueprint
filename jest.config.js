module.exports = {
  rootDir: ".",
  roots: ["<rootDir>/test"],
  collectCoverageFrom: ["<rootDir>/src/**/*.{ts,tsx,js,jsx}"],
  coverageProvider: "v8",
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
    "^@akshay-na/exoframe/(.*)$": "<rootDir>/src/lib/src/$1",
    "^@/(.*)$": ["<rootDir>/src/$1", "<rootDir>/node_modules/@types/$1"],
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
    "/src/lib/",
  ],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },
};
