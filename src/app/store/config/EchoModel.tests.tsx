import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import * as loads from "app/utils/jsonFiles"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import fetchMock from "jest-fetch-mock"
import moment from "moment"
import { Echo } from "./EchoModel"

const appJsonSpy = jest.spyOn(loads, "appJson")
const echoLaunchJsonSpy = jest.spyOn(loads, "echoLaunchJson")

const originalDate = moment("2021-03-20T14:41:42.845Z")
const earlierDate = originalDate.clone().subtract(2, "days")
const laterDate = originalDate.clone().add(2, "days")

const appVersion = (version: string) => ({
  version,
  isAndroidBeta: false,
  appName: "eigen",
  expoReleaseName: "none",
  expoDist: "none",
})

const _echoLaunchJsonActual = loads.echoLaunchJson()
const echo = (overrides: Partial<Echo>): Echo => ({
  ..._echoLaunchJsonActual,
  updated_at: originalDate.toISOString(),
  ...overrides,
})
echoLaunchJsonSpy.mockReturnValue(echo({}))

beforeEach(() => {
  fetchMock.mockReset()
})

const getEchoState = () => {
  return __globalStoreTestUtils__?.getCurrentState().artsyPrefs.echo.state
}

const forceUpdateMessage = () => {
  return __globalStoreTestUtils__?.getCurrentState().artsyPrefs.echo.forceUpdateMessage
}

describe("Echo", () => {
  it("uses the bundled version when the app loads", () => {
    expect(getEchoState()?.updated_at).toEqual(originalDate.toISOString())
  })

  it("fetches the latest version after the app loads", async () => {
    // rehydration doesn't happen at test time by default, but always happens in actual usage
    // so if we want to test things triggered by rehydration we need to explicitly call it here
    expect(getEchoState()?.updated_at).toEqual(originalDate.toISOString())
    const updatedEcho = echo({
      updated_at: laterDate.toISOString(),
    })
    fetchMock.mockResponseOnce(JSON.stringify(updatedEcho))

    GlobalStore.actions.rehydrate({})
    await flushPromiseQueue()
    expect(fetchMock).toHaveBeenCalledWith("https://echo.artsy.net/Echo.json")

    expect(getEchoState()?.updated_at).not.toEqual(originalDate.toISOString())
    expect(getEchoState()?.updated_at).toEqual(updatedEcho.updated_at)
  })

  it("is rehydrated if the stored version is newer than the bundled version", () => {
    expect(getEchoState()?.updated_at).toEqual(originalDate.toISOString())
    const newEcho = echo({
      updated_at: laterDate.toISOString(),
    })
    GlobalStore.actions.rehydrate({ artsyPrefs: { echo: { state: newEcho } } })
    expect(getEchoState()?.updated_at).toEqual(newEcho.updated_at)
  })

  it("is not rehydrated if the stored version is older than the bundled version", () => {
    expect(getEchoState()?.updated_at).toEqual(originalDate.toISOString())
    const oldEcho = echo({
      updated_at: earlierDate.toISOString(),
    })
    GlobalStore.actions.rehydrate({ artsyPrefs: { echo: { state: oldEcho } } })
    expect(getEchoState()?.updated_at).toEqual(originalDate.toISOString())
    expect(getEchoState()?.updated_at).not.toEqual(oldEcho.updated_at)
  })

  describe("computes forceUpdateMessage correctly", () => {
    it("when it is a valid version", () => {
      appJsonSpy.mockReturnValue(appVersion("2.0.0"))
      const echoConfig = echo({
        messages: [
          { name: "KillSwitchBuildMinimum", content: "1.5.0" },
          { name: "KillSwitchBuildMinimumAndroid", content: "1.5.0" },
        ],
        killedVersions: { ios: {}, android: {} },
      })
      GlobalStore.actions.__manipulate((state) => {
        state.artsyPrefs.echo.state = echoConfig
      })
      expect(forceUpdateMessage()).toEqual(undefined)
    })

    it("when the version number is less than the minumum required version", () => {
      appJsonSpy.mockReturnValue(appVersion("1.2.0"))
      const echoConfig = echo({
        messages: [
          { name: "KillSwitchBuildMinimum", content: "1.5.0" },
          { name: "KillSwitchBuildMinimumAndroid", content: "1.5.0" },
        ],
        killedVersions: { ios: {}, android: {} },
      })
      GlobalStore.actions.__manipulate((state) => {
        state.artsyPrefs.echo.state = echoConfig
      })
      expect(forceUpdateMessage()).toEqual(
        "New app version required. Please update your Artsy app to continue."
      )
    })

    it("when the version number is exactly the minumum required version", () => {
      appJsonSpy.mockReturnValue(appVersion("1.5.0"))
      const echoConfig = echo({
        messages: [
          { name: "KillSwitchBuildMinimum", content: "1.5.0" },
          { name: "KillSwitchBuildMinimumAndroid", content: "1.5.0" },
        ],
        killedVersions: { ios: {}, android: {} },
      })
      GlobalStore.actions.__manipulate((state) => {
        state.artsyPrefs.echo.state = echoConfig
      })
      expect(forceUpdateMessage()).toEqual(undefined)
    })

    it("when the version number is included in the killedVersions", () => {
      appJsonSpy.mockReturnValue(appVersion("1.7.0"))
      const echoConfig = echo({
        messages: [
          { name: "KillSwitchBuildMinimum", content: "1.5.0" },
          { name: "KillSwitchBuildMinimumAndroid", content: "1.5.0" },
        ],
        killedVersions: {
          ios: { "1.7.0": { message: "time to update!" } },
          android: { "1.7.0": { message: "time to update!" } },
        },
      })
      GlobalStore.actions.__manipulate((state) => {
        state.artsyPrefs.echo.state = echoConfig
      })
      expect(forceUpdateMessage()).toEqual("time to update!")
    })

    it("works with hydration too", () => {
      appJsonSpy.mockReturnValue(appVersion("1.6.0"))
      const echoConfig1 = echo({
        messages: [
          { name: "KillSwitchBuildMinimum", content: "1.5.0" },
          { name: "KillSwitchBuildMinimumAndroid", content: "1.5.0" },
        ],
        killedVersions: {
          ios: { "1.3.0": { message: "time to update 1!" } },
          android: { "1.3.0": { message: "time to update 1!" } },
        },
      })
      GlobalStore.actions.__manipulate((state) => {
        state.artsyPrefs.echo.state = echoConfig1
      })
      expect(forceUpdateMessage()).toEqual(undefined)

      const echoConfig2 = echo({
        messages: [
          { name: "KillSwitchBuildMinimum", content: "1.5.0" },
          { name: "KillSwitchBuildMinimumAndroid", content: "1.5.0" },
        ],
        killedVersions: {
          ios: { "1.6.0": { message: "time to update 2!" } },
          android: { "1.6.0": { message: "time to update 2!" } },
        },
      })
      GlobalStore.actions.rehydrate({ artsyPrefs: { echo: { state: echoConfig2 } } })
      expect(forceUpdateMessage()).toEqual("time to update 2!")
    })
  })
})
