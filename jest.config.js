const moduleNameMap = require("./alias").jestModuleNameMap

module.exports = {
  cacheDirectory: ".cache/jest",
  moduleFileExtensions: ["ts", "tsx", "js"],
  moduleNameMapper: moduleNameMap,
  preset: "react-native",
  rootDir: "./",
  setupFilesAfterEnv: [
    "jest-extended/all",
    "./src/setupJest.tsx",
    "./node_modules/react-native-gesture-handler/jestSetup.js",
  ],
  testMatch: ["<rootDir>/**/*.tests.(ts|tsx|js)"],
  testEnvironment: "jest-environment-jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
  transform: {
    "^[./a-zA-Z0-9$_-]+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$":
      "<rootDir>/node_modules/react-native/jest/assetFileTransformer.js",
    "\\.graphql$": "jest-raw-loader",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native(-.*)?/(@react-native-community/.*))?|react-navigation|@react-navigation/.*)",
  ],
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
}
