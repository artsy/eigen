---
name: bump-ios-version
description: Bump iOS and Xcode versions in Eigen. Use when the user wants to upgrade iOS SDK version, update Xcode version, change simulator version, or update CI configuration for new iOS/Xcode releases.
---

# Bump iOS/Xcode Version

This skill guides you through bumping the iOS and Xcode version in Eigen.

## Before You Start

**Prompt the user for the target version:**

- Ask which iOS version they want to bump to (e.g., "26.2")
- Ask which Xcode version they want to use (e.g., "26.2")
- Ask which iPhone model to use for simulators (e.g., "iPhone 17 Pro")

**Verify version support before making changes:**

### CircleCI Support

Check supported Xcode versions at: https://circleci.com/developer/machine/image/xcode

Currently supported versions include:

- 26.2, 26.1.1, 26.1, 26.0.1, 26.0
- 16.4, 16.3, 16.2

### GitHub Actions Support

Check macOS runner images at: https://github.com/actions/runner-images

For macOS 15 runners, available Xcode versions include:

- 26.2, 26.1.1, 26.0.1
- 16.4 (default), 16.3, 16.2, 16.1, 16.0

If the requested version is not supported by both CI systems, warn the user that CI builds may fail.

### iPhone Device Compatibility

Different iOS versions require specific iPhone simulator models. **You must verify the iPhone model is available for the target iOS version in CircleCI's image manifest.**

**How to verify:**

1. Go to https://circleci.com/docs/guides/test/testing-ios/#supported-xcode-versions
2. Find the target Xcode version row
3. Click on "Installed software" link in the "VM Software Manifest" column
4. In the manifest, search for the iOS version to see which iPhone simulators are available

**Example compatibility (from CircleCI Xcode 26.2 manifest):**

| iOS Version | Available iPhone Models                                                 |
| ----------- | ----------------------------------------------------------------------- |
| iOS 18.x    | iPhone 16 Pro, iPhone 16 Pro Max, iPhone 16, iPhone 16 Plus, iPhone 16e |
| iOS 26.x    | iPhone 17 Pro, iPhone 17 Pro Max, iPhone 17, iPhone Air, iPhone 16e     |

**Important:** iOS 26 simulators require iPhone 17 series devices. Using iPhone 16 Pro with iOS 26 will fail because it's not available in the manifest.

## Steps

### 1. Update `ios-config.json` (single source of truth)

Update ALL fields in `ios-config.json` at the project root:

```json
{
  "xcode_version": "<NEW_XCODE_VERSION>",
  "ios_version": "<NEW_IOS_VERSION>",
  "iphone_model": "<NEW_IPHONE_MODEL>",
  "simulator_device_type": "com.apple.CoreSimulator.SimDeviceType.<DEVICE-TYPE-ID>",
  "simulator_runtime": "com.apple.CoreSimulator.SimRuntime.iOS-<MAJOR>-<MINOR>"
}
```

### 2. Update `.circleci/config.yml` (cannot read from JSON at runtime)

CircleCI pipeline parameter defaults must be static YAML values. Update these three values in the `parameters` section:

```yaml
parameters:
  xcode_version:
    type: string
    default: "<NEW_XCODE_VERSION>"
  simulator_version:
    type: string
    default: "<NEW_IOS_VERSION>"
```

Also update the `device` in the `macos/preboot-simulator` step of the `build-test-app-ios` job:

```yaml
- macos/preboot-simulator:
    version: << pipeline.parameters.simulator_version >>
    platform: "iOS"
    device: "<NEW_IPHONE_MODEL>"
```

### 3. That's It!

The following files read directly from `ios-config.json` and need NO manual updates:

- `scripts/ci/ci-setup-export-vars` (reads via `jq`)
- `scripts/utils/doctor.js` (reads via `fs.readFileSync` + `JSON.parse`)
- `fastlane/Fastfile` (reads via `File.read` + `JSON.parse`)
- `.github/actions/setup-ios-environment/action.yml` (reads via `jq`)
- `.github/workflows/ios-e2e-maestro.yml` (reads via `jq`)
- `ios/ArtsyTests/Supporting_Files/ARTestHelper.m` (reads via `NSJSONSerialization` from test bundle)

## Summary Checklist

- [ ] Verify target Xcode version is supported by CircleCI
- [ ] Verify target Xcode version is supported by GitHub Actions
- [ ] Verify iPhone model is available for target iOS version (check CircleCI manifest)
- [ ] Update `ios-config.json`
- [ ] Update `.circleci/config.yml` (xcode_version, simulator_version, preboot-simulator device)

## Testing (done by user)

After making changes:

1. Push changes and verify CircleCI builds pass
2. Verify GitHub Actions E2E tests create the simulator correctly
