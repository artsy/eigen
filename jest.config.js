const swcConfig = require("./.swcrc.js")
const moduleNameMap = require("./alias").jestModuleNameMap

const ENABLE_SWC = true

if (ENABLE_SWC) {
  console.log("[jest.config.js] Experimental SWC Compiler is enabled.\n")
}

module.exports = {
  cacheDirectory: ".cache/jest",
  moduleFileExtensions: ["ts", "tsx", "js"],
  moduleNameMapper: moduleNameMap,
  preset: "react-native",
  rootDir: "./",
  setupFilesAfterEnv: [
    "jest-extended/all",
    "@testing-library/jest-native/extend-expect",
    "./src/setupJest.tsx",
  ],
  testMatch: ["<rootDir>/**/*.tests.(ts|tsx|js)"],
  testEnvironment: "jest-environment-jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
  transform: {
    "^[./a-zA-Z0-9$_-]+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$":
      "<rootDir>/node_modules/react-native/jest/assetFileTransformer.js",
    "\\.(gql|graphql)$": "@graphql-tools/jest-transform",
    "^.+/((@)?react-native|node_modules)/.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(js|ts|jsx|tsx)$": ["@swc/jest", swcConfig],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native(-.*)?/(@react-native-community/.*))?|react-navigation|@react-navigation/.*)",
  ],
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
}
