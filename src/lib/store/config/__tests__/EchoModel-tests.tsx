import fetchMock from "jest-fetch-mock"
import { __globalStoreTestUtils__, GlobalStore } from "lib/store/GlobalStore"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import echoLaunchJSON from "../../../../../Artsy/App/EchoNew.json"

jest.mock("../../../../../Artsy/App/EchoNew.json", () => ({
  ...jest.requireActual("../../../../../Artsy/App/EchoNew.json"),
  updated_at: "2021-02-04T11:10:33.768Z",
}))

beforeEach(() => {
  fetchMock.mockReset()
})

const getEchoState = () => {
  return __globalStoreTestUtils__?.getCurrentState().config.echo.json!
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
    GlobalStore.actions.rehydrate({ config: { echo: { json: newEcho } } })
    expect(getEchoState()?.updated_at).toEqual(newEcho.updated_at)
  })
  it("is not rehydrated if the stored version is older than the bundled version", () => {
    const oldEcho: typeof echoLaunchJSON = {
      ...echoLaunchJSON,
      updated_at: "2021-02-01T11:10:33.768Z",
    }
    expect(getEchoState()?.updated_at).toEqual(echoLaunchJSON.updated_at)
    GlobalStore.actions.rehydrate({ config: { echo: { json: oldEcho } } })
    expect(getEchoState()?.updated_at).toEqual(echoLaunchJSON.updated_at)
    expect(getEchoState()?.updated_at).not.toEqual(oldEcho.updated_at)
  })
})
