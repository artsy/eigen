/** @type {import('@expo/fingerprint').Config} */
const config = {
  sourceSkips: ["ExpoConfigRuntimeVersionIfString", "ExpoConfigVersions"],
  ignorePaths: [
    // Android build artifacts (everywhere including inside node_modules)
    "**/android/build/**/*",
    "**/.gradle/**/*",
    "**/.cxx/**/*",
    "**/.idea/**/*", // IntelliJ/Android Studio
    "**/android/local.properties",
    "**/*.iml",
    "**/assets/**/*",
    "**/google-services*.json",
    "**/*.apk", // Android build artifacts
    "android/.kotlin/", // Kotlin compiler cache
    "**/*.keystore",
    "**/android-secret.json",

    // Eclipse/IntelliJ build outputs and IDE files (anywhere in node_modules)
    "**/.classpath",
    "**/.project",
    "**/.settings/**/*",

    // iOS build artifacts and user-specific data
    "**/xcuserdata/**/*",
    "ios/*.xcworkspace/**/*",
    "ios/*.xcodeproj/project.xcworkspace/**/*",
    "derived_data/", // Xcode derived data (root level)
    "ios/tmp.xcconfig",
    "**/GoogleService-Info*.plist",
    "**/AppCenter-Config.plist", // AppCenter configuration
    "ios/Pods/**/*",

    // Build directories and artifacts
    "build/", // Root-level build directory
    "build-cache-provider/", // Custom build cache provider
    "archives/", // Archive directory
    "**/*.jsbundle.map", // JavaScript bundle source maps
    "**/tsconfig.tsbuildinfo", // TypeScript build info

    // General system/IDE files
    "**/.DS_Store", // macOS system files
    "**/.ruby-lsp/**/*", // Ruby language server cache
    "**/*.log",
    "**/.claude/**/*",

    // Environment files (test/dev-specific)
    ".env.maestro", // Maestro test config
    ".env.maestro.android", // Android Maestro config
    ".env.maestro.ios", // iOS Maestro config
    "Brewfile.lock.json", // Homebrew dependencies
    "**/.i-had-a-netrc-file", // netrc file
    // Node modules
    "node_modules/react-native-keys/**/*",
    "**/node_modules/react-native-keys/**/*",
  ],
}
module.exports = config
