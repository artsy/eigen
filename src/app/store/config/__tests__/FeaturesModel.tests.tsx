import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { DevToggleDescriptor, FeatureDescriptor, features } from "app/store/config/features"
import { echoLaunchJson } from "app/utils/jsonFiles"
import * as loads from "app/utils/jsonFiles"

const echoLaunchJsonSpy = jest.spyOn(loads, "echoLaunchJson")

const echoLaunchJsonActual = loads.echoLaunchJson()
const mockEcho = {
  ...echoLaunchJsonActual,
  features: [
    { name: "FeatureAEchoKey", value: true },
    { name: "FeatureBEchoKey", value: false },
  ],
}
echoLaunchJsonSpy.mockReturnValue(mockEcho)

type TestFeatures = "FeatureA" | "FeatureB"
type TestDevToggles = "DevToggleA"

jest.mock("app/store/config/features", () => {
  const mockFeatures: { readonly [key: string]: FeatureDescriptor } = {
    FeatureA: {
      readyForRelease: true,
      echoFlagKey: "FeatureAEchoKey",
    },
    FeatureB: {
      readyForRelease: false,
    },
  }
  const mockDevToggles: { readonly [key: string]: DevToggleDescriptor } = {
    DevToggleA: {
      description: "A useful dev toggle",
    },
  }
  return {
    features: mockFeatures,
    devToggles: mockDevToggles,
  }
})

const getComputedFeatures = () =>
  __globalStoreTestUtils__?.getCurrentState().artsyPrefs.features.flags as unknown as Record<
    TestFeatures,
    boolean
  >
const getComputedDevToggles = () =>
  __globalStoreTestUtils__?.getCurrentState().artsyPrefs.features.devToggles as unknown as Record<
    TestDevToggles,
    boolean
  >

describe("Feature flags", () => {
  it("are taken from the features definition map and turned into a computed boolean map in the global store", () => {
    expect(Object.keys(getComputedFeatures()).sort()).toEqual(Object.keys(features).sort())
    expect(typeof getComputedFeatures().FeatureA).toBe("boolean")
  })
  it("are true if the feature is ready for release, and false if not", () => {
    expect(getComputedFeatures().FeatureA).toBe(true)
    expect(getComputedFeatures().FeatureB).toBe(false)
  })
  it("support local overrides", () => {
    expect(getComputedFeatures().FeatureA).toBe(true)
    GlobalStore.actions.artsyPrefs.features.setLocalOverride({
      key: "FeatureA" as any,
      value: false,
    })
    expect(getComputedFeatures().FeatureA).toBe(false)
    GlobalStore.actions.artsyPrefs.features.setLocalOverride({
      key: "FeatureA" as any,
      value: null,
    })
    expect(getComputedFeatures().FeatureA).toBe(true)

    expect(getComputedFeatures().FeatureB).toBe(false)
    GlobalStore.actions.artsyPrefs.features.setLocalOverride({
      key: "FeatureB" as any,
      value: true,
    })
    expect(getComputedFeatures().FeatureB).toBe(true)
    GlobalStore.actions.artsyPrefs.features.setLocalOverride({
      key: "FeatureB" as any,
      value: null,
    })
    expect(getComputedFeatures().FeatureB).toBe(false)

    GlobalStore.actions.artsyPrefs.features.setLocalOverride({
      key: "DevToggleA" as any,
      value: true,
    })
    expect(getComputedDevToggles().DevToggleA).toBe(true)
  })
  it("use echo if an echo flag is given and the feature is ready for release", () => {
    expect(getComputedFeatures().FeatureA).toBe(true)
    // set A's echo flag to false
    GlobalStore.actions.artsyPrefs.echo.setEchoState({
      ...echoLaunchJson(),
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
    GlobalStore.actions.artsyPrefs.echo.setEchoState({
      ...echoLaunchJson(),
      features: [
        { name: "FeatureAEchoKey", value: false },
        { name: "FeatureBEchoKey", value: true },
      ],
    })
    expect(getComputedFeatures().FeatureB).toBe(false)
  })
})
