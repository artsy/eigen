import echoLaunchJSON from "../../../../../Artsy/App/EchoNew.json"
import { __globalStoreTestUtils__, GlobalStore } from "../../GlobalStore"
import { FeatureDescriptor, features } from "../features"

jest.mock("../../../../../Artsy/App/EchoNew.json", () => {
  const echo: Partial<typeof echoLaunchJSON> = {
    updated_at: "2021-02-04T11:10:33.768Z",
    features: [
      { name: "FeatureAEchoKey", value: true },
      { name: "FeatureBEchoKey", value: false },
    ],
  }

  return echo
})

type TestFeatures = "FeatureA" | "FeatureB"

jest.mock("lib/store/config/features", () => {
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
    GlobalStore.actions.config.features.setAdminOverride({ key: "FeatureA" as any, value: false })
    expect(getComputedFeatures().FeatureA).toBe(false)
    GlobalStore.actions.config.features.setAdminOverride({ key: "FeatureA" as any, value: null })
    expect(getComputedFeatures().FeatureA).toBe(true)

    expect(getComputedFeatures().FeatureB).toBe(false)
    GlobalStore.actions.config.features.setAdminOverride({ key: "FeatureB" as any, value: true })
    expect(getComputedFeatures().FeatureB).toBe(true)
    GlobalStore.actions.config.features.setAdminOverride({ key: "FeatureB" as any, value: null })
    expect(getComputedFeatures().FeatureB).toBe(false)
  })
  it("use echo if an echo flag is given and the feature is ready for release", () => {
    expect(getComputedFeatures().FeatureA).toBe(true)
    // set A's echo flag to false
    GlobalStore.actions.config.echo.setEchoState({
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
    GlobalStore.actions.config.echo.setEchoState({
      ...echoLaunchJSON,
      features: [
        { name: "FeatureAEchoKey", value: false },
        { name: "FeatureBEchoKey", value: true },
      ],
    })
    expect(getComputedFeatures().FeatureB).toBe(false)
  })
})
