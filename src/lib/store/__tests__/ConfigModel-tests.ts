import fetchMock from "jest-fetch-mock"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import echoLaunchJSON from "../../../../Artsy/App/EchoNew.json"
import { ConfigModel } from "../ConfigModel"
import { FeatureDescriptor, features } from "../features"
import { __globalStoreTestUtils__, GlobalStore } from "../GlobalStore"

type TestFeatures = "FeatureA" | "FeatureB"

jest.mock("../../../../Artsy/App/EchoNew.json", () => {
  const echo: Partial<ConfigModel["echoState"]> = {
    updated_at: "2021-02-04T11:10:33.768Z",
    features: [
      { name: "FeatureAEchoKey", value: true },
      { name: "FeatureBEchoKey", value: false },
    ],
  }

  return echo
})

jest.mock("lib/store/features", () => {
  const mockFeatures: { readonly [key: string]: FeatureDescriptor } = {
    FeatureA: {
      readyForRelease: true,
      echoFlagKey: "FeatureAEchoKey",
    },
    FeatureB: {
      readyForRelease: false,
      echoFlagKey: "FeatureBEchoKey",
    },
  }
  return {
    features: mockFeatures,
  }
})

beforeEach(() => {
  fetchMock.mockReset()
})

const getEchoState = () => {
  return __globalStoreTestUtils__?.getCurrentState().config.echoState!
}

const getComputedFeatures = () => {
  return (__globalStoreTestUtils__?.getCurrentState().config.features! as any) as Record<TestFeatures, boolean>
}

describe("Feature flags", () => {
  it("are taken from the features definition map and turned into a computed boolean map in the global store", () => {
    expect(Object.keys(getComputedFeatures()).sort()).toEqual(Object.keys(features).sort())
    expect(typeof getComputedFeatures().FeatureA).toBe("boolean")
  })
  it("are true if the feature is ready for release, and false if not", () => {
    expect(getComputedFeatures().FeatureA).toBe(true)
    expect(getComputedFeatures().FeatureB).toBe(false)
  })
  it("support admin overrides", () => {
    expect(getComputedFeatures().FeatureA).toBe(true)
    GlobalStore.actions.config.setAdminOverride({ key: "FeatureA" as any, value: false })
    expect(getComputedFeatures().FeatureA).toBe(false)
    GlobalStore.actions.config.setAdminOverride({ key: "FeatureA" as any, value: null })
    expect(getComputedFeatures().FeatureA).toBe(true)

    expect(getComputedFeatures().FeatureB).toBe(false)
    GlobalStore.actions.config.setAdminOverride({ key: "FeatureB" as any, value: true })
    expect(getComputedFeatures().FeatureB).toBe(true)
    GlobalStore.actions.config.setAdminOverride({ key: "FeatureB" as any, value: null })
    expect(getComputedFeatures().FeatureB).toBe(false)
  })
  it("use echo if an echo flag is given and the feature is ready for release", () => {
    expect(getComputedFeatures().FeatureA).toBe(true)
    // set A's echo flag to false
    GlobalStore.actions.config.setEchoState({
      ...echoLaunchJSON,
      features: [
        { name: "FeatureAEchoKey", value: false },
        { name: "FeatureBEchoKey", value: false },
      ],
    })
    expect(getComputedFeatures().FeatureA).toBe(false)
  })

  it("ignores echo if feature is not ready for release", () => {
    expect(getComputedFeatures().FeatureB).toBe(false)
    // set A's echo flag to false
    GlobalStore.actions.config.setEchoState({
      ...echoLaunchJSON,
      features: [
        { name: "FeatureAEchoKey", value: false },
        { name: "FeatureBEchoKey", value: true },
      ],
    })
    expect(getComputedFeatures().FeatureB).toBe(false)
  })
})

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
    GlobalStore.actions.rehydrate({ config: { echoState: newEcho } })
    expect(getEchoState()?.updated_at).toEqual(newEcho.updated_at)
  })
  it("is not rehydrated if the stored version is older than the bundled version", () => {
    const oldEcho: typeof echoLaunchJSON = {
      ...echoLaunchJSON,
      updated_at: "2021-02-01T11:10:33.768Z",
    }
    expect(getEchoState()?.updated_at).toEqual(echoLaunchJSON.updated_at)
    GlobalStore.actions.rehydrate({ config: { echoState: oldEcho } })
    expect(getEchoState()?.updated_at).toEqual(echoLaunchJSON.updated_at)
    expect(getEchoState()?.updated_at).not.toEqual(oldEcho.updated_at)
  })
})
