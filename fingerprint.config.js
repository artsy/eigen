/** @type {import('@expo/fingerprint').Config} */
const config = {
  sourceSkips: ["ExpoConfigRuntimeVersionIfString", "ExpoConfigVersions"],
  ignorePaths: [
    // Android build artifacts (everywhere including inside node_modules)
    // "**/android/build/**/*", // ❌
    // "**/.gradle/**/*", // ❌
    // "**/.cxx/**/*", // ❌
    "**/android/local.properties",
    // "**/*.iml", // ❌

    // Gradle plugin build outputs inside node_modules
    // "**/*gradle-plugin/build/**/*", // ❌
    // "**/*gradle-plugin/bin/**/*", // ❌

    // Eclipse/IntelliJ build outputs and IDE files (anywhere in node_modules)
    // "**/android/bin/**/*", // ❌
    "**/.classpath",
    "**/.project",
    "**/.settings/**/*",

    // iOS build artifacts and user-specific data
    // "ios/Pods/**/*", // ❌
    "**/xcuserdata/**/*",
    "ios/*.xcworkspace/**/*",
    "ios/*.xcodeproj/project.xcworkspace/**/*",
    // "ios/DerivedData/**/*", // ❌
    "ios/tmp.xcconfig",

    // General system/IDE files ❌
    // "**/.DS_Store",
    // "**/*.log",
    // "**/.claude/**/*",

    // Node modules
    "node_modules/react-native-keys/**/*",
    "**/node_modules/react-native-keys/**/*",
  ],
}
module.exports = config
