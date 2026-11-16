import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useE2EInitialization } from "app/system/devTools/useE2EInitialization"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { LaunchArguments } from "react-native-launch-arguments"

jest.mock("react-native-launch-arguments", () => ({
  LaunchArguments: { value: jest.fn() },
}))

const TestComponent = () => {
  useE2EInitialization()
  return null
}

describe("useE2EInitialization", () => {
  const mockLaunchArguments = (args: object) => {
    ;(LaunchArguments.value as jest.Mock).mockReturnValue(args)
  }

  const localOverrides = () =>
    __globalStoreTestUtils__?.getCurrentState().artsyPrefs.features.localOverrides

  it("turns on the feature flags named in enableFeatureFlags", () => {
    mockLaunchArguments({
      useE2EInit: true,
      enableFeatureFlags: "AREnableShareShowPartnerFeature, NotARealFlag",
    })

    renderWithWrappers(<TestComponent />)

    expect(localOverrides()).toMatchObject({ AREnableShareShowPartnerFeature: true })
    expect(localOverrides()).not.toHaveProperty("NotARealFlag")
  })

  it("ignores enableFeatureFlags outside e2e runs", () => {
    mockLaunchArguments({ enableFeatureFlags: "AREnableShareShowPartnerFeature" })

    renderWithWrappers(<TestComponent />)

    expect(localOverrides()).not.toHaveProperty("AREnableShareShowPartnerFeature")
  })
})
