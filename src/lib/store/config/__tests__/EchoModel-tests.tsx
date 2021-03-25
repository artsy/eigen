import fetchMock from "jest-fetch-mock"
import { __globalStoreTestUtils__, GlobalStore } from "lib/store/GlobalStore"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import moment from "moment"
import { Echo } from "../EchoModel"

import * as loads from "lib/utils/jsonFiles"
const appJsonSpy = jest.spyOn(loads, "appJson")

const originalDate = moment("2021-03-11T13:48:50.923Z") // Updated by `update-echo`, and is in sync with `EchoNew.json`.
const earlierDate = originalDate.clone().subtract(2, "days")
const laterDate = originalDate.clone().add(2, "days")

const echoLaunchJsonActual = loads.echoLaunchJson()
const echo = (overrides: Partial<Echo>): Echo => ({
  ...echoLaunchJsonActual,
  updated_at: originalDate.toISOString(),
  ...overrides,
})

beforeEach(() => {
  fetchMock.mockReset()
})

const getEchoState = () => {
  return __globalStoreTestUtils__?.getCurrentState().config.echo.state
}

const forceUpdateMessage = () => {
  return __globalStoreTestUtils__?.getCurrentState().config.echo.forceUpdateMessage
}

describe("Echo", () => {
  it("uses the bundled version when the app loads", () => {
    expect(getEchoState()?.updated_at).toEqual(echoLaunchJsonActual.updated_at)
  })

  it("fetches the latest version after the app loads", async () => {
    // rehydration doesn't happen at test time by default, but always happens in actual usage
    // so if we want to test things triggered by rehydration we need to explicitly call it here
    expect(getEchoState()?.updated_at).toEqual(echoLaunchJsonActual.updated_at)
    const updatedEcho = echo({
      updated_at: laterDate.toISOString(),
    })
    fetchMock.mockResponseOnce(JSON.stringify(updatedEcho))

    GlobalStore.actions.rehydrate({})
    await flushPromiseQueue()
    expect(fetchMock).toHaveBeenCalledWith("https://echo.artsy.net/Echo.json")

    expect(getEchoState()?.updated_at).not.toEqual(echoLaunchJsonActual.updated_at)
    expect(getEchoState()?.updated_at).toEqual(updatedEcho.updated_at)
  })

  it("is rehydrated if the stored version is newer than the bundled version", () => {
    const newEcho = echo({
      updated_at: laterDate.toISOString(),
    })
    expect(getEchoState()?.updated_at).toEqual(echoLaunchJsonActual.updated_at)
    GlobalStore.actions.rehydrate({ config: { echo: { state: newEcho } } })
    expect(getEchoState()?.updated_at).toEqual(newEcho.updated_at)
  })

  it("is not rehydrated if the stored version is older than the bundled version", () => {
    const oldEcho = echo({
      updated_at: earlierDate.toISOString(),
    })
    expect(getEchoState()?.updated_at).toEqual(echoLaunchJsonActual.updated_at)
    GlobalStore.actions.rehydrate({ config: { echo: { state: oldEcho } } })
    expect(getEchoState()?.updated_at).toEqual(echoLaunchJsonActual.updated_at)
    expect(getEchoState()?.updated_at).not.toEqual(oldEcho.updated_at)
  })

  describe("computes forceUpdateMessage correctly", () => {
    it("when it is a valid version", () => {
      appJsonSpy.mockReturnValue({ version: "2.0.0" })
      const echoConfig = echo({
        messages: [
          { name: "KillSwitchBuildMinimum", content: "1.5.0" },
          { name: "KillSwitchBuildMinimumAndroid", content: "1.5.0" },
        ],
        killedVersions: { ios: {}, android: {} },
      })
      GlobalStore.actions.manipulate((state) => {
        state.config.echo.state = echoConfig
      })
      expect(forceUpdateMessage()).toEqual(undefined)
    })

    it("when the version number is less than the minumum required version", () => {
      appJsonSpy.mockReturnValue({ version: "1.2.0" })
      const echoConfig = echo({
        messages: [
          { name: "KillSwitchBuildMinimum", content: "1.5.0" },
          { name: "KillSwitchBuildMinimumAndroid", content: "1.5.0" },
        ],
        killedVersions: { ios: {}, android: {} },
      })
      GlobalStore.actions.manipulate((state) => {
        state.config.echo.state = echoConfig
      })
      expect(forceUpdateMessage()).toEqual("New app version required. Please update your Artsy app to continue.")
    })

    it("when the version number is exactly the minumum required version", () => {
      appJsonSpy.mockReturnValue({ version: "1.5.0" })
      const echoConfig = echo({
        messages: [
          { name: "KillSwitchBuildMinimum", content: "1.5.0" },
          { name: "KillSwitchBuildMinimumAndroid", content: "1.5.0" },
        ],
        killedVersions: { ios: {}, android: {} },
      })
      GlobalStore.actions.manipulate((state) => {
        state.config.echo.state = echoConfig
      })
      expect(forceUpdateMessage()).toEqual(undefined)
    })

    it("when the version number is included in the killedVersions", () => {
      appJsonSpy.mockReturnValue({ version: "1.7.0" })
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
      GlobalStore.actions.manipulate((state) => {
        state.config.echo.state = echoConfig
      })
      expect(forceUpdateMessage()).toEqual("time to update!")
    })

    it("works with hydration too", () => {
      appJsonSpy.mockReturnValue({ version: "1.6.0" })
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
      GlobalStore.actions.manipulate((state) => {
        state.config.echo.state = echoConfig1
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
      GlobalStore.actions.rehydrate({ config: { echo: { state: echoConfig2 } } })
      expect(forceUpdateMessage()).toEqual("time to update 2!")
    })
  })
})
