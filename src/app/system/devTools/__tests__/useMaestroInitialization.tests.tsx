import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useMaestroInitialization } from "app/system/devTools/useMaestroInitialization"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { LaunchArguments } from "react-native-launch-arguments"

jest.mock("react-native-launch-arguments", () => ({
  LaunchArguments: { value: jest.fn() },
}))

const TestComponent = () => {
  useMaestroInitialization()
  return null
}

describe("useMaestroInitialization", () => {
  const mockLaunchArguments = (args: object) => {
    ;(LaunchArguments.value as jest.Mock).mockReturnValue(args)
  }

  const localOverrides = () =>
    __globalStoreTestUtils__?.getCurrentState().artsyPrefs.features.localOverrides

  it("turns on the feature flags named in enableFeatureFlags", () => {
    mockLaunchArguments({
      useMaestroInit: true,
      enableFeatureFlags: "AREnableShareShowPartnerFeature, NotARealFlag",
    })

    renderWithWrappers(<TestComponent />)

    expect(localOverrides()).toMatchObject({ AREnableShareShowPartnerFeature: true })
    expect(localOverrides()).not.toHaveProperty("NotARealFlag")
  })

  it("ignores enableFeatureFlags outside Maestro runs", () => {
    mockLaunchArguments({ enableFeatureFlags: "AREnableShareShowPartnerFeature" })

    renderWithWrappers(<TestComponent />)

    expect(localOverrides()).not.toHaveProperty("AREnableShareShowPartnerFeature")
  })
})
