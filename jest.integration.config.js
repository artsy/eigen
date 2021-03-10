module.exports = {
  ...require('./jest.config'),
  testMatch: ["<rootDir>/src/**/*.integration-test.(ts|tsx|js)"],
  setupFilesAfterEnv: ["./src/setupJest.integration.ts"],
  testTimeout: 15000
}
