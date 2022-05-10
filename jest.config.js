const moduleNameMap = require("./alias").jestModuleNameMap

module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js"],
  rootDir: "./",
  moduleNameMapper: moduleNameMap,
  testMatch: ["<rootDir>/**/*.tests.(ts|tsx|js)"],
  testEnvironment: "jsdom",
  testURL: "http://localhost/",
  setupFilesAfterEnv: [
    "jest-extended",
    "@testing-library/jest-native/extend-expect",
    "./src/setupJest.ts",
  ],
  cacheDirectory: ".jest/cache",
  transform: {
    "^[./a-zA-Z0-9$_-]+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$":
      "<rootDir>/node_modules/react-native/jest/assetFileTransformer.js",
    ".*(ts|tsx|js|jsx)$": "babel-jest",
    "\\.graphql$": "jest-raw-loader",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native(-.*)?/(@react-native-community/.*))?|react-navigation|@react-navigation/.*)",
  ],
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
}
