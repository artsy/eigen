/** @type {import('@expo/fingerprint').Config} */
const config = {
  sourceSkips: ["ExpoConfigRuntimeVersionIfString", "ExpoConfigVersions"],
  ignorePaths: [
    // Android build artifacts (everywhere including inside node_modules)
    "**/android/build/**/*", // ❌ TESTING
    "**/.gradle/**/*", // ❌ TESTING
    "**/.cxx/**/*", // ❌ TESTING
    "**/.idea/**/*", // IntelliJ/Android Studio // ❌ TESTING
    "**/android/local.properties",
    "**/*.iml",
    "**/assets/**/*",
    "**/google-services*.json",
    "**/*.apk", // Android build artifacts // ❌ TESTING
    "android/.kotlin/", // Kotlin compiler cache// ❌ TESTING
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
    "derived_data/", // Xcode derived data (root level)// ❌ TESTING
    "ios/tmp.xcconfig",
    "**/GoogleService-Info*.plist",
    "**/AppCenter-Config.plist", // AppCenter configuration// ❌ TESTING
    "ios/Pods/**/*.plist", // Generated Pod plists// ❌ TESTING
    "ios/Pods/**/*.modulemap", // Generated module maps// ❌ TESTING
    "ios/Pods/**/*-umbrella.h", // Generated umbrella headers// ❌ TESTING
    "ios/Pods/.last_build_configuration", // Pod build state// ❌ TESTING
    "ios/Pods/*-artifacts/**/*", // Pod artifacts// ❌ TESTING
    "ios/Pods/Headers/**/*", // Pod headers (generated)// ❌ TESTING

    // Build directories and artifacts
    "build/", // Root-level build directory// ❌ TESTING
    "build-cache-provider/", // Custom build cache provider// ❌ TESTING
    "archives/", // Archive directory// ❌ TESTING
    "**/*.jsbundle.map", // JavaScript bundle source maps// ❌ TESTING
    "**/tsconfig.tsbuildinfo", // TypeScript build info// ❌ TESTING

    // General system/IDE files ❌
    "**/.DS_Store", // macOS system files// ❌ TESTING
    "**/.ruby-lsp/**/*", // Ruby language server cache// ❌ TESTING
    "**/*.log",
    // "**/.claude/**/*",

    // Environment files (test/dev-specific)
    ".env.maestro", // Maestro test config// ❌ TESTING
    ".env.maestro.android", // Android Maestro config// ❌ TESTING
    ".env.maestro.ios", // iOS Maestro config// ❌ TESTING
    "Brewfile.lock.json", // Homebrew dependencies// ❌ TESTING
    "**/.i-had-a-netrc-file", // netrc file// ❌ TESTING
    // Node modules
    "node_modules/react-native-keys/**/*",
    "**/node_modules/react-native-keys/**/*",
  ],
}
module.exports = config
