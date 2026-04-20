# Build Caching

Eigen uses a two-tier build caching system to avoid unnecessary native rebuilds. When the native layer of the app hasn't changed, a cached build is reused instead — dramatically reducing build times locally and on CI.

## How It Works

The system is built on two components:

**1. `expo-build-disk-cache`** — An Expo CLI plugin that intercepts the build process. It checks for a locally cached build before compiling. If a cache hit is found it installs the cached app directly, skipping compilation entirely.

**2. Custom S3 plugin** ([expo/plugins/build-cache-s3/index.js](../expo/plugins/build-cache-s3/index.js)) — Extends `expo-build-disk-cache` as a remote plugin. When there's a local disk cache miss, it checks S3 for a matching build. If found, it downloads and uses it. After a successful build, it can upload the result back to S3 for future use.

**Cache key**: Both layers key the cache on the [Expo fingerprint](https://docs.expo.dev/versions/latest/sdk/fingerprint/) — a hash of all native-affecting files (native code, native dependencies, Expo config, etc.). If the fingerprint hasn't changed, the cached build is used.

The config lives in `app.json`:

```json
"buildCacheProvider": {
  "plugin": "expo-build-disk-cache",
  "options": {
    "cacheDir": "node_modules/.expo-build-disk-cache",
    "remotePlugin": "./expo/plugins/build-cache-s3",
    "remoteOptions": {
      "bucket": "mobile-cached-builds",
      "prefix": "eigen/cached-builds"
    }
  }
}
```

**Cache artifact format**: Builds are stored as compressed archives keyed by fingerprint hash and platform, e.g.:

```
s3://mobile-cached-builds/eigen/cached-builds/<fingerprint>.ios.tar.gz
s3://mobile-cached-builds/eigen/cached-builds/<fingerprint>.android.tar.gz
```

---

## Running Locally

To use the build cache locally you must run the app through Expo CLI (not directly via Xcode or Android Studio):

```sh
# iOS
bundle exec npx expo run:ios

# Android
npx expo run:android
```

### Enabling S3 Upload Locally

By default the S3 plugin only downloads from S3 — it does not upload. To also upload your build to S3 (so others can reuse it), it is set in `.env.development.local`:

```sh
EXPO_BUILD_CACHE_UPLOAD=1
```

This file is not gitignored and committed to the repo as an example and has a default value of 1 (enabled).

Make sure you have valid AWS credentials configured locally (`~/.aws/credentials` or environment variables) with access to the `mobile-cached-builds` bucket.

### Clearing the Local Cache

```sh
yarn clear-local-build-cache
```

This removes `node_modules/.expo-build-disk-cache`. The next build will check S3 and fall back to a full compile if nothing is found there either.

---

## Debug Options

Two environment variables control debug behaviour:

| Variable                 | Description                                                                                                                                                                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EXPO_BUILD_CACHE_DEBUG` | Set to `true` to enable verbose logging from the S3 plugin. Logs are prefixed with `[s3-cache:debug]`.                                                                                                                                                                                            |
| `EXPO_FINGERPRINT_DEBUG` | CI-only (GitHub Actions secret). When set to `true`, the fingerprint check workflow generates a full debug fingerprint and uploads it to `s3://mobile-cached-builds/eigen-expo-fingerprint/latest-debug.txt`. Useful for inspecting exactly which files are contributing to the fingerprint hash. |

To enable S3 debug logging locally, add to `.env.development.local` (it is false by default):

```sh
EXPO_BUILD_CACHE_DEBUG=true
```

You'll then see logs like:

```
[s3-cache] 🔍 Looking for fingerprint abc123... in S3
[s3-cache:debug] Build path does not exist: ...
[s3-cache] ❌ No fingerprint abc123... found in S3
```

### Inspecting the Fingerprint

To see what the current fingerprint hash is and what files contribute to it:

```sh
# Current hash only
npx @expo/fingerprint fingerprint:generate | jq -r '.hash'

# Full debug output (what files are included and their hashes)
npx @expo/fingerprint fingerprint:generate --debug
```

The fingerprint is configured in [fingerprint.config.js](../fingerprint.config.js) — build artifacts, IDE files, Pods, Gradle caches, and other non-native files are explicitly excluded so they don't cause unnecessary cache misses.

---

## How It Runs on CI

CI uses three GitHub Actions workflows that work together:

### 1. `expo-fingerprint-check` ([.github/workflows/expo-fingerprint-check.yml](../.github/workflows/expo-fingerprint-check.yml))

Runs on every push to `main`. It:

1. Generates the current Expo fingerprint hash
2. Downloads the previously stored fingerprint from `s3://mobile-cached-builds/eigen-expo-fingerprint/latest.txt`
3. Compares the two — if they match, no builds are needed
4. If they differ, checks S3 for existing cached builds for each platform (in case the fingerprint changed but a build was already uploaded for it)
5. Outputs `needs_ios_build` and `needs_android_build` flags as artifacts for downstream workflows
6. Saves the new fingerprint to S3 if builds are needed

### 2. `ios-expo-build` ([.github/workflows/ios-expo-build.yml](../.github/workflows/ios-expo-build.yml))

Triggered automatically after `expo-fingerprint-check` completes. It:

1. Downloads the `needs_ios_build` artifact from the fingerprint check
2. Exits early if no build is needed
3. Otherwise: sets up the full iOS environment (macOS 15, Xcode, simulator), then runs `bundle exec npx expo run:ios --no-bundler`
4. `EXPO_BUILD_CACHE_UPLOAD=1` is set in the job environment — so after a successful build the result is automatically uploaded to S3

### 3. `android-expo-build` ([.github/workflows/android-expo-build.yml](../.github/workflows/android-expo-build.yml))

Same pattern as the iOS workflow but for Android. Runs on `ubuntu-latest` with an Android emulator (API 34, x86_64). Runs `npx expo run:android --no-bundler` with `EXPO_BUILD_CACHE_UPLOAD=1`.

### CI Flow Summary

```
push to main
    │
    ▼
expo-fingerprint-check
    │
    ├── fingerprint unchanged → skip both builds ✅
    │
    └── fingerprint changed
            │
            ├── S3 already has iOS build → skip iOS build ✅
            ├── S3 already has Android build → skip Android build ✅
            │
            ├── ios-expo-build
            │       └── builds & uploads .ios.tar.gz to S3
            │
            └── android-expo-build
                    └── builds & uploads .android.tar.gz to S3
```

Both build workflows can also be triggered manually from the GitHub Actions tab (`workflow_dispatch`).

---

## Troubleshooting

### Cache miss when you expect a hit

The fingerprint hash changed. Run the fingerprint debug command to find out why:

```sh
npx @expo/fingerprint fingerprint:generate --debug
```

Compare the output to a previous run (or the `latest-debug.txt` in S3 if `EXPO_FINGERPRINT_DEBUG` is enabled) to find the file(s) that changed. Common culprits:

- A native dependency was added or updated (`package.json`, `yarn.lock`)
- `ios/Podfile` or `android/build.gradle` changed
- An Expo config plugin was modified
- A new file was added that isn't excluded in `fingerprint.config.js`

If a file is being included that shouldn't affect the native build, add it to the `ignorePaths` list in [fingerprint.config.js](../fingerprint.config.js).

### S3 download is slow or fails

The S3 plugin uses `aws s3 cp` with native progress output. If it fails:

- Verify AWS credentials are configured: `aws sts get-caller-identity`
- Check you have access to the `mobile-cached-builds` bucket: `aws s3 ls s3://mobile-cached-builds/eigen/cached-builds/`
- Enable debug logging (`EXPO_BUILD_CACHE_DEBUG=true`) to see the exact S3 path being checked

### Build succeeds but doesn't upload to S3

`EXPO_BUILD_CACHE_UPLOAD=1` must be set. Check `.env.development.local` (locally) or the workflow environment (CI).
