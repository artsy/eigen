import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import AppInfo from "app/system/AppInfo"
import * as loads from "app/utils/jsonFiles"

const appJsonSpy = jest.spyOn(loads, "appJson")

jest.mock("react-native-device-info", () => ({
  getBuildNumber: jest.fn(),
  getVersion: jest.fn(),
}))

import { getBuildNumber, getVersion } from "react-native-device-info"

const appVersion = (version: string) => ({
  version,
  isAndroidBeta: false,
  appName: "eigen",
  nativeCodeVersion: {
    "1": "some-hash",
  },
  codePushReleaseName: "none",
  codePushDist: "none",
})

describe("AppInfo", () => {
  describe("version", () => {
    it("returns the version from app.json", () => {
      appJsonSpy.mockReturnValue(appVersion("2.0.0"))
      ArtsyNativeModule.isBetaOrDev = false

      expect(AppInfo.getVersion()).toEqual("2.0.0")
    })

    it("returns the version from react-native-device-info when app.json value isn't available", () => {
      appJsonSpy.mockReturnValue(appVersion(""))
      ArtsyNativeModule.isBetaOrDev = false
      ;(getVersion as jest.Mock).mockImplementationOnce(() => "2.5.0")

      expect(AppInfo.getVersion()).toEqual("2.5.0")
    })

    it("affixes beta label to the version if the app is in beta or dev mode", () => {
      appJsonSpy.mockReturnValue(appVersion("2.0.0"))
      ArtsyNativeModule.isBetaOrDev = true

      expect(AppInfo.getVersion()).toEqual("2.0.0-beta")
    })

    describe("when build metadata is requested", () => {
      it("returns the build number when available", () => {
        appJsonSpy.mockReturnValue(appVersion("2.0.0"))
        ArtsyNativeModule.isBetaOrDev = false
        ;(getBuildNumber as jest.Mock).mockImplementationOnce(() => "123")

        expect(AppInfo.getVersion({ includeBuildMetadata: true })).toEqual("2.0.0+build.123")
      })

      it("returns the short commit sha if the build number is unavailable", () => {
        appJsonSpy.mockReturnValue(appVersion("2.0.0"))
        ArtsyNativeModule.isBetaOrDev = false
        ;(getBuildNumber as jest.Mock).mockImplementationOnce(() => "")
        ArtsyNativeModule.gitCommitShortHash = "abc123"

        expect(AppInfo.getVersion({ includeBuildMetadata: true })).toEqual("2.0.0+sha.abc123")
      })

      it("does not apply build metadata if neither build number nor commit sha are available", () => {
        appJsonSpy.mockReturnValue(appVersion("2.0.0"))
        ArtsyNativeModule.isBetaOrDev = false
        ;(getBuildNumber as jest.Mock).mockImplementationOnce(() => "")
        ArtsyNativeModule.gitCommitShortHash = ""

        expect(AppInfo.getVersion({ includeBuildMetadata: true })).toEqual("2.0.0")
      })
    })
  })
})
