import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/packages", "<rootDir>/apps"],
  testMatch: ["**/__tests__/**/*.ts", "**/*.spec.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "packages/**/*.ts",
    "apps/**/*.ts",
    "!**/*.spec.ts",
    "!**/node_modules/**",
    "!**/dist/**",
  ],
  moduleNameMapper: {
    "^@core/(.*)$": "<rootDir>/packages/core/$1",
    "^@api/(.*)$": "<rootDir>/apps/api/$1",
  },
  globals: {
    "ts-jest": {
      tsconfig: {
        esModuleInterop: true,
      },
    },
  },
};

export default config;
