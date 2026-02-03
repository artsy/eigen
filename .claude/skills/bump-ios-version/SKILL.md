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

The iPhone model for CI is set in `scripts/ci/ci-setup-export-vars` via the `DEVICE_HOST_NAME` variable.

## Files to Update

When bumping iOS/Xcode version, update the following files:

### 1. CircleCI Configuration

**File:** `.circleci/config.yml`

Update the parameters section:

```yaml
parameters:
  xcode_version:
    type: string
    default: "<NEW_XCODE_VERSION>" # e.g., "26.2"
  simulator_version:
    type: string
    default: "<NEW_IOS_VERSION>" # e.g., "26.2"
```

Also update the `macos/preboot-simulator` device in the `build-test-app-ios` job:

```yaml
- macos/preboot-simulator:
    version: << pipeline.parameters.simulator_version >>
    platform: "iOS"
    device: "iPhone <MODEL> Pro" # e.g., "iPhone 17 Pro"
```

### 2. GitHub Actions E2E Workflow

**File:** `.github/workflows/ios-e2e-maestro.yml`

Update the simulator creation step:

- Update the step name: `Create and boot iPhone <MODEL> Pro iOS <VERSION> simulator`
- Update the echo message with the new iOS version
- Update the simulator device type: `com.apple.CoreSimulator.SimDeviceType.iPhone-<MODEL>-Pro` (e.g., `iPhone-17-Pro`)
- Update the simulator runtime: `com.apple.CoreSimulator.SimRuntime.iOS-<MAJOR>-<MINOR>` (e.g., `iOS-26-2`)

### 3. CI Export Variables Script

**File:** `scripts/ci/ci-setup-export-vars`

Update:

```bash
export DEVICE_HOST_OS="<NEW_IOS_VERSION>"     # e.g., "26.2"
export DEVICE_HOST_NAME="iPhone <MODEL> Pro"  # Update if device model changes
```

### 4. Doctor Script (Developer Environment Check)

**File:** `scripts/utils/doctor.js`

Update the desired Xcode version:

```javascript
const desiredVersions = {
  xcode: "<NEW_XCODE_VERSION>",  # e.g., "26.2"
  // ... other versions
}
```

### 5. iOS Test Helper (Snapshot Tests)

**File:** `ios/ArtsyTests/Supporting_Files/ARTestHelper.m`

Update the iOS version assertion:

```objc
NSAssert(version.majorVersion == <MAJOR> && version.minorVersion == <MINOR>,
         @"The tests should be run on iOS <VERSION>, not %ld.%ld", ...);
```

## Summary Checklist

- [ ] Verify target Xcode version is supported by CircleCI
- [ ] Verify target Xcode version is supported by GitHub Actions
- [ ] Verify iPhone model is available for target iOS version (check CircleCI manifest)
- [ ] Update `.circleci/config.yml` (xcode_version, simulator_version, preboot-simulator device)
- [ ] Update `.github/workflows/ios-e2e-maestro.yml` (simulator device type, runtime)
- [ ] Update `scripts/ci/ci-setup-export-vars` (DEVICE_HOST_OS, DEVICE_HOST_NAME)
- [ ] Update `scripts/utils/doctor.js` (desiredVersions.xcode)
- [ ] Update `ios/ArtsyTests/Supporting_Files/ARTestHelper.m` (version assertion)

## Testing (done by user)

After making changes:

1. Push changes and verify CircleCI builds pass
2. Verify GitHub Actions E2E tests create the simulator correctly
