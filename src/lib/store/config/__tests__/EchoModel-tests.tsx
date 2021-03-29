import fetchMock from "jest-fetch-mock"
import { __globalStoreTestUtils__, GlobalStore } from "lib/store/GlobalStore"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import echoLaunchJSON from "../../../../../Artsy/App/EchoNew.json"

jest.mock("../../../../../Artsy/App/EchoNew.json", () => ({
  ...jest.requireActual("../../../../../Artsy/App/EchoNew.json"),
  updated_at: "2021-02-04T11:10:33.768Z",
}))

jest.mock("../../../../../app.json", () => ({
  version: "2.0.0",
}))

beforeEach(() => {
  fetchMock.mockReset()
})

const getEchoState = () => {
  return __globalStoreTestUtils__?.getCurrentState().config.echo.state!
}

const forceUpdateMessage = () => {
  return __globalStoreTestUtils__?.getCurrentState().config.echo.forceUpdateMessage!
}

describe("Echo", () => {
  it("uses the bundled version when the app loads", () => {
    expect(getEchoState()?.updated_at).toEqual("2021-02-04T11:10:33.768Z")
  })
  it("fetches the latest version after the app loads", async () => {
    // rehydration doesn't happen at test time by default, but always happens in actual usage
    // so if we want to test things triggered by rehydration we need to explicitly call it here
    expect(echoLaunchJSON.updated_at).toEqual(getEchoState()?.updated_at)
    const updatedEcho: typeof echoLaunchJSON = {
      ...echoLaunchJSON,
      updated_at: "2021-02-05T11:10:33.768Z",
    }
    fetchMock.mockResponseOnce(JSON.stringify(updatedEcho))

    GlobalStore.actions.rehydrate({})
    await flushPromiseQueue()
    expect(fetchMock).toHaveBeenCalledWith("https://echo.artsy.net/Echo.json")

    expect(getEchoState()?.updated_at).not.toEqual(echoLaunchJSON.updated_at)
    expect(getEchoState()?.updated_at).toEqual(updatedEcho.updated_at)
  })
  it("is rehydrated if the stored version is newer than the bundled version", () => {
    const newEcho: typeof echoLaunchJSON = {
      ...echoLaunchJSON,
      updated_at: "2021-02-05T11:10:33.768Z",
    }
    expect(getEchoState()?.updated_at).toEqual(echoLaunchJSON.updated_at)
    GlobalStore.actions.rehydrate({ config: { echo: { state: newEcho } } })
    expect(getEchoState()?.updated_at).toEqual(newEcho.updated_at)
  })
  it("is not rehydrated if the stored version is older than the bundled version", () => {
    const oldEcho: typeof echoLaunchJSON = {
      ...echoLaunchJSON,
      updated_at: "2021-02-01T11:10:33.768Z",
    }
    expect(getEchoState()?.updated_at).toEqual(echoLaunchJSON.updated_at)
    GlobalStore.actions.rehydrate({ config: { echo: { state: oldEcho } } })
    expect(getEchoState()?.updated_at).toEqual(echoLaunchJSON.updated_at)
    expect(getEchoState()?.updated_at).not.toEqual(oldEcho.updated_at)
  })

  describe("computes forceUpdateMessage correctly", () => {
    it("when it is a valid version", () => {
      const validVersionEcho: any = {
        ...echoLaunchJSON,
        updated_at: "2021-02-05T11:10:33.768Z",
        messages: [
          { name: "KillSwitchBuildMinimum", content: "1.5.0" },
          { name: "KillSwitchBuildMinimumAndroid", content: "1.5.0" },
        ],
        killedVersions: {
          ios: {
            "1.9.0": {
              message: "Please update the app",
            },
          },
          android: {
            "1.9.0": {
              message: "Please update the app",
            },
          },
        },
      }

      GlobalStore.actions.rehydrate({ config: { echo: { state: validVersionEcho } } })
      expect(forceUpdateMessage()).toEqual(undefined)
    })

    it("when the version number is less than the minumum required version", () => {
      const validVersionEcho: any = {
        ...echoLaunchJSON,
        updated_at: "2021-02-05T11:10:33.768Z",
        messages: [
          { name: "KillSwitchBuildMinimum", content: "2.5.0" },
          { name: "KillSwitchBuildMinimumAndroid", content: "2.5.0" },
        ],
        killedVersions: {
          ios: {
            "1.9.0": {
              message: "Please update the app",
            },
          },
          android: {
            "1.9.0": {
              message: "Please update the app",
            },
          },
        },
      }
      GlobalStore.actions.rehydrate({ config: { echo: { state: validVersionEcho } } })
      expect(forceUpdateMessage()).toEqual("New app version required, Please update your Artsy app to continue.")
    })

    it("when the version number is included in the killedVersions", () => {
      const validVersionEcho: any = {
        ...echoLaunchJSON,
        updated_at: "2021-02-05T11:10:33.768Z",
        messages: [
          { name: "KillSwitchBuildMinimum", content: "1.5.0" },
          { name: "KillSwitchBuildMinimumAndroid", content: "1.5.0" },
        ],
        killedVersions: {
          ios: {
            "2.0.0": {
              message: "Please update the app",
            },
          },
          android: {
            "2.0.0": {
              message: "Please update the app",
            },
          },
        },
      }
      GlobalStore.actions.rehydrate({ config: { echo: { state: validVersionEcho } } })
      expect(forceUpdateMessage()).toEqual("Please update the app")
    })
  })
})
